local QBCore = exports["qb-core"]:GetCoreObject()
local json = require("json") 


RegisterNetEvent("Exit", function()
    local src = source
    DropPlayer(src, "You left the server")
end)

