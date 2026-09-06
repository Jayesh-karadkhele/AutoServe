$Utf8NoBom = New-Object System.Text.UTF8Encoding $false
$lombokJar = "C:\Users\HP\.m2\repository\org\projectlombok\lombok\1.18.34\lombok-1.18.34.jar"
$slf4jJar = "C:\Users\HP\.m2\repository\org\slf4j\slf4j-api\2.0.17\slf4j-api-2.0.17.jar"
$m2Cp = (Get-Content "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\classpath.txt" -Raw).Trim()
$targetClasses = "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\target\classes"

if (!(Test-Path $targetClasses)) {
    New-Item -ItemType Directory -Path $targetClasses | Out-Null
}

$cpPass1 = "$lombokJar;$slf4jJar;$targetClasses;$m2Cp"

# Pass 1: Compile Entities, DTOs, Exceptions, Repositories, and AuthProperties
$pass1Sources = Get-ChildItem -Path "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\main\java\com\car_backend\entities",
                                  "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\main\java\com\car_backend\dto",
                                  "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\main\java\com\car_backend\exceptions",
                                  "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\main\java\com\car_backend\repository" -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName
$pass1Sources += "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\main\java\com\car_backend\config\AuthProperties.java"

[System.IO.File]::WriteAllLines("c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass1_sources.txt", $pass1Sources, $Utf8NoBom)

$args1 = @(
    "-proc:full",
    "-processorpath", $lombokJar,
    "-cp", $cpPass1,
    "-d", $targetClasses
)
[System.IO.File]::WriteAllLines("c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass1_args.txt", $args1, $Utf8NoBom)

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

Write-Host "Executing Pass 1 (Entities, DTOs, Exceptions, Repositories & AuthProperties)..."
& javac $jFlags "@c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass1_args.txt" "@c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass1_sources.txt"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Pass 1 compilation failed!"
    exit 1
}

# Pass 2: Compile remaining sources (Services, Security, Controllers, Config)
$pass2Sources = Get-ChildItem -Path "c:\Users\HP\Desktop\Projets\AutoServe-main\backend\src\main\java" -Recurse -Filter "*.java" | 
    Where-Object { 
        $_.FullName -notmatch "\\entities\\" -and 
        $_.FullName -notmatch "\\dto\\" -and 
        $_.FullName -notmatch "\\exceptions\\" -and 
        $_.FullName -notmatch "\\repository\\" -and 
        $_.FullName -notmatch "AuthProperties\.java" 
    } | Select-Object -ExpandProperty FullName
[System.IO.File]::WriteAllLines("c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass2_sources.txt", $pass2Sources, $Utf8NoBom)

$cpPass2 = "$targetClasses;$lombokJar;$slf4jJar;$m2Cp"
$args2 = @(
    "-proc:full",
    "-processorpath", $lombokJar,
    "-cp", $cpPass2,
    "-d", $targetClasses
)
[System.IO.File]::WriteAllLines("c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass2_args.txt", $args2, $Utf8NoBom)

Write-Host "Executing Pass 2 (Services, Security, Controllers, Config)..."
& javac $jFlags "@c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass2_args.txt" "@c:\Users\HP\Desktop\Projets\AutoServe-main\backend\pass2_sources.txt"

if ($LASTEXITCODE -eq 0) {
    Write-Host "BUILD SUCCESS: All main backend classes compiled cleanly into target/classes!"
} else {
    Write-Error "Pass 2 compilation failed!"
}
