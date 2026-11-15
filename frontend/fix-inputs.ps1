$files = Get-ChildItem -Path "C:\PROJECT's\Nexora\frontend\src" -Recurse -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $old = "background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)'"
    $new = "background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)'"
    if ($content -and $content.Contains($old)) {
        $content.Replace($old, $new) | Set-Content $file.FullName -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}
Write-Host "Done."
