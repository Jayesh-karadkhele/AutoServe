$Utf8NoBom = New-Object System.Text.UTF8Encoding $false
$lombokJar = "C:\Users\HP\.m2\repository\org\projectlombok\lombok\1.18.34\lombok-1.18.34.jar"
$slf4jJar = "C:\Users\HP\.m2\repository\org\slf4j\slf4j-api\2.0.17\slf4j-api-2.0.17.jar"
$m2Cp = (Get-Content "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\classpath.txt" -Raw).Trim()
$targetClasses = "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\target\classes"
$targetTestClasses = "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\target\test-classes"

if (!(Test-Path $targetTestClasses)) {
    New-Item -ItemType Directory -Path $targetTestClasses | Out-Null
}

$fullCp = "$targetTestClasses;$targetClasses;$lombokJar;$slf4jJar;$m2Cp"
$testSources = Get-ChildItem -Path "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\test\java" -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName
[System.IO.File]::WriteAllLines("c:\Users\HP\Desktop\Projets\AutoServe-main\backend\test_sources.txt", $testSources, $Utf8NoBom)

$testArgs = @(
    "-proc:full",
    "-processorpath", $lombokJar,
    "-cp", $fullCp,
    "-d", $targetTestClasses
)
[System.IO.File]::WriteAllLines("c:\Users\HP\Desktop\Projets\AutoServe-main\backend\test_args.txt", $testArgs, $Utf8NoBom)

$jFlags = @(
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.comp=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.main=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.model=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.processing=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED"',
    '-J"--add-opens=jdk.compiler/com.sun.tools.javac.jvm=ALL-UNNAMED"'
)

Write-Host "Compiling Backend Test Sources..."
& javac $jFlags "@c:\Users\HP\Desktop\Projets\AutoServe-main\backend\test_args.txt" "@c:\Users\HP\Desktop\Projets\AutoServe-main\backend\test_sources.txt"

if ($LASTEXITCODE -eq 0) {
    Write-Host "BUILD SUCCESS: All test classes compiled cleanly into target/test-classes!"
} else {
    Write-Error "Test compilation failed!"
}
