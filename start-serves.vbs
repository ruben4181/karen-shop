Set oShell = CreateObject("WScript.Shell")

strCmd = "cmd /K cd C:\karen-shop\server && npm start"

oShell.Run strCmd, 0, false

Set oShell = Nothing