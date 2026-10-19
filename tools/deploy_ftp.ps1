# tools/deploy_ftp.ps1 - Direct FTP Uploader for Hostinger Shared Hosting
param (
    [Parameter(Mandatory=$false)]
    [string]$TargetEnv = "develop" # "develop" or "prod"
)

$configFile = "$PSScriptRoot\ftp_config.json"
$config = @{}

if (Test-Path $configFile) {
    try {
        $config = Get-Content $configFile -Raw | ConvertFrom-Json -AsHashtable
    } catch {
        Write-Warning "Could not parse ftp_config.json. Prompting for details..."
    }
}

$ftpServer = $config["FTP_SERVER"]
$ftpUser = $config["FTP_USERNAME"]
$ftpPass = $config["FTP_PASSWORD"]

if (-not $ftpServer) {
    $ftpServer = Read-Host "Enter Hostinger FTP Host (e.g. ftp.yourdomain.com or server IP)"
}
if (-not $ftpUser) {
    $ftpUser = Read-Host "Enter Hostinger FTP Username"
}
if (-not $ftpPass) {
    $securePass = Read-Host "Enter Hostinger FTP Password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    $ftpPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

$remoteSubDir = if ($TargetEnv -eq "develop") { 
    if ($config["FTP_DEV_DIR"]) { $config["FTP_DEV_DIR"] } else { "public_html/dev" } 
} else { 
    if ($config["FTP_PROD_DIR"]) { $config["FTP_PROD_DIR"] } else { "public_html" } 
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Hostinger Direct Deploy -> $TargetEnv ($remoteSubDir)" -ForegroundColor Cyan
Write-Host " Server: $ftpServer | User: $ftpUser" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseDir = (Get-Item "$PSScriptRoot\..").FullName

# Clean server path
$remoteSubDir = $remoteSubDir.Trim("/")

function Ensure-FtpDirectory($ftpPath, $user, $pass) {
    try {
        $request = [System.Net.FtpWebRequest]::Create($ftpPath)
        $request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $request.UseBinary = $true
        $request.KeepAlive = $false
        $response = $request.GetResponse()
        $response.Close()
    } catch {
        # Directory may already exist, ignore error
    }
}

function Upload-FtpFile($localFile, $remoteUrl, $user, $pass) {
    $webClient = New-Object System.Net.WebClient
    $webClient.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
    try {
        $webClient.UploadFile($remoteUrl, $localFile)
        Write-Host "  Uploaded: $remoteUrl" -ForegroundColor Green
    } catch {
        Write-Warning "Failed to upload $localFile : $($_.Exception.Message)"
    }
}

# Collect files to deploy: index.php, .htaccess, and backend/**
$filesToUpload = @()
if (Test-Path "$baseDir\index.php") { $filesToUpload += (Get-Item "$baseDir\index.php") }
if (Test-Path "$baseDir\.htaccess") { $filesToUpload += (Get-Item "$baseDir\.htaccess") }
if (Test-Path "$baseDir\backend") {
    $filesToUpload += (Get-ChildItem -Path "$baseDir\backend" -Recurse -File)
}

Write-Host "Found $($filesToUpload.Count) files to upload..." -ForegroundColor Yellow

# Ensure base remote directory exists
$baseUrl = "ftp://$ftpServer/$remoteSubDir"
$parts = $remoteSubDir -split "/"
$currentPart = "ftp://$ftpServer"
foreach ($p in $parts) {
    $currentPart += "/$p"
    Ensure-FtpDirectory $currentPart $ftpUser $ftpPass
}

$createdDirs = @{}
foreach ($file in $filesToUpload) {
    $relativePath = $file.FullName.Substring($baseDir.Length + 1).Replace("\", "/")
    $remoteFileUrl = "$baseUrl/$relativePath"
    
    # Check parent directory
    $parentDir = [System.IO.Path]::GetDirectoryName($relativePath).Replace("\", "/")
    if ($parentDir -and -not $createdDirs.ContainsKey($parentDir)) {
        $subParts = $parentDir -split "/"
        $cur = $baseUrl
        foreach ($sp in $subParts) {
            $cur += "/$sp"
            if (-not $createdDirs.ContainsKey($cur)) {
                Ensure-FtpDirectory $cur $ftpUser $ftpPass
                $createdDirs[$cur] = $true
            }
        }
        $createdDirs[$parentDir] = $true
    }
    
    Upload-FtpFile $file.FullName $remoteFileUrl $ftpUser $ftpPass
}

Write-Host ""
Write-Host "Deployment completed successfully to $TargetEnv!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
