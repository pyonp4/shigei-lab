# 画像のまわりに白い余白を足して 16:9 にする（切り抜かない）
# このファイルは BOM 付き UTF-8 で保存する（Windows PowerShell 5.1 で日本語のコメントを読むため）
# 使い方：powershell -File pad16x9.ps1 -Src 元の画像 -Out 出力先.png [-Margin 24]
param(
  [Parameter(Mandatory = $true)][string]$Src,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Margin = 24   # 左右（縦長の画像では上下）に最低限あける余白（px）
)

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path $Src))

# 元の画像に余白を足した大きさを基準に，16:9 になるよう縦か横を広げる
$w = $img.Width + $Margin * 2
$h = $img.Height + $Margin * 2
if ($w * 9 -ge $h * 16) {
  $h = [int][Math]::Round($w * 9 / 16)
} else {
  $w = [int][Math]::Round($h * 16 / 9)
}

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$x = [int](($w - $img.Width) / 2)
$y = [int](($h - $img.Height) / 2)
$g.DrawImage($img, $x, $y, $img.Width, $img.Height)
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose(); $bmp.Dispose(); $img.Dispose()
"$w x $h -> $Out"
