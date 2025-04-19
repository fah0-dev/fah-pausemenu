local QBCore = exports['qb-core']:GetCoreObject()
local cam = true
local fov = 70.0
local Player = QBCore.Functions.GetPlayerData()
local name = Player.charinfo.firstname .. " " .. Player.charinfo.lastname
local typeCam = 5
RegisterNuiCallback("typeCam", function(data, cb)
typeCam = data
end)
-- open menu
CreateThread(function()
    while true do
        SetPauseMenuActive(false)
        Wait(0)
    end
end)
CreateThread(function()
    DisableIdleCamera(true)
    while true do
        if IsControlJustPressed(0, 200) or IsControlJustPressed(0, 199) then
                if cam  then
                    print("Cam is ON")
                    Citizen.CreateThread(function()
                        local ped = PlayerPedId()
                        local handle = RegisterPedheadshot(ped)
            
                        while not IsPedheadshotReady(handle) or not IsPedheadshotValid(handle) do
                            Citizen.Wait(0)
                        end
            
                        local txd = GetPedheadshotTxdString(handle)
            
                        local coords = GetEntityCoords(ped)
                        local streetHash, crossingHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
                        local streetName = GetStreetNameFromHashKey(streetHash)
                        local zone = GetNameOfZone(coords.x, coords.y, coords.z)
                        local zoneLabel = GetLabelText(zone)
            
            
            
                        SendNUIMessage({
                            type = "showImage",
                            image = txd,
                            health = GetEntityHealth(PlayerPedId()),
                            name = name,
                            location = zoneLabel .. " - " .. streetName,
                      
                        })
            
                        UnregisterPedheadshot(handle)
                        if typeCam == 1  then
                            OpenMenu()
                        else
                            defaulcam(1)
                        end
                    end)
                    
                    local health = GetEntityHealth(PlayerPedId())
                    SendNUIMessage({
                        type = "data",
                        name = name,
                        health = health,
                    })
                    
                    
                    cam = false
                else
                  
                    CloseMenu()
                end
            end
            Wait(0)
        end
  
end)




-- function to open menu
function OpenMenu()
    if not IsPedInAnyVehicle(PlayerPedId(), true) then
        local playerPed = PlayerPedId()

        local playerCoords = GetEntityCoords(playerPed)
        local heading = GetEntityHeading(playerPed)
        local headingRad = math.rad(heading)

        local forwardDist = 1.5
        local sideOffset = 1.0

        local forwardX = -math.sin(headingRad) * forwardDist
        local forwardY = math.cos(headingRad) * forwardDist
        local rightX = math.cos(headingRad) * sideOffset
        local rightY = math.sin(headingRad) * sideOffset

        local camX = playerCoords.x + forwardX + rightX
        local camY = playerCoords.y + forwardY + rightY
        local camZ = playerCoords.z + 0.1

        CamHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", camX, camY, camZ, 0.0, 0.0, 0.0, fov, false, 0)
        PointCamAtEntity(CamHandle, playerPed, 0.0, 0.0, 0.6)


        TaskLookAtCoord(playerPed, camX, camY, camZ, -1, 0, 2)

        SetCamUseShallowDofMode(CamHandle, true)
        SetCamNearDof(CamHandle, 0.2)
        SetCamFarDof(CamHandle, 5.0)
        SetCamDofStrength(CamHandle, 1.0)

        SetCamActive(CamHandle, true)
        RenderScriptCams(true, true, 500, true, true)
        info(1)


        SendNUIMessage({
            type = "open"
        })

        local Player = QBCore.Functions.GetPlayerData()


        local BoneCoords = GetPedBoneCoords(PlayerPedId(), 60309, -0.6, 0.0, 0.0)
        local isOnScreen, screenX, screenY = GetScreenCoordFromWorldCoord(BoneCoords.x, BoneCoords.y, BoneCoords.z)


        cam = false
        SetNuiFocus(true, true)
    end
end

-- function to close menu
function CloseMenu()
    if CamHandle then
        RenderScriptCams(false, true, 500, true, true)
        DestroyCam(CamHandle, false)
        CamHandle = nil
        local ped = PlayerPedId()
        ClearPedTasks(ped)
        FreezeEntityPosition(ped, false)
        SetEntityInvincible(ped, false)
        SetEntityCollision(ped, true, true)
        SendNUIMessage({
            type = "close"
        })
        SetNuiFocus(false, false)
        cam = true
    end
end


-- function to update info menu
function info(f)
    CreateThread(function()
        f = f or 0

        local playerPed = PlayerPedId()
        while true do
           
            local chestCoords = GetEntityCoords(playerPed)
            local OnScreen, screenX, screenY = GetScreenCoordFromWorldCoord(chestCoords.x, chestCoords.y, chestCoords.z)
            
            if OnScreen then
                SendNUIMessage({
                    type = "update",
                    x = screenX,
                    y = screenY,
                    cam = f
                })
                SendNUIMessage({
                    type = "data",
                    job = Player.job.name,
                    bank = "$" .. Player.money['bank'],
                    cash = "$" .. Player.money['cash'],
                    gang = Player.gang.name,
                })
                
            end
            Wait(500)
        end
    end)
end

-- function to defaulcam 
function defaulcam()
    info(2)
    RenderScriptCams(false, true, 500, true, true)
    DestroyCam(CamHandle, false)
    CamHandle = nil
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "open"
    })

    cam = true
end

-- call back cam settings
RegisterNUICallback("cam", function(data, cb)
    if data == "1" then
        OpenMenu()
        typeCam = 1
    else
        defaulcam()
        typeCam = 2
   end
end)

-- call back close menu
RegisterNuiCallback("close", function(data, cb)
    print("Close")
    CloseMenu()
    SetNuiFocus(false, false)
    local setting = {
        cam = data.cam,
        color = data.color,
    }
   
end)

-- call back menu
RegisterNuiCallback("menu", function(data, cb)

    if data == 'settings' then
        ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_LANDING_MENU'), 0, -1)
        SetNuiFocus(false, false)
    elseif data == 'Map' then
        ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_MP_PAUSE'), 0, -1)
        SetNuiFocus(false, false)
    elseif data == 'Exit' then
        SetNuiFocus(false, false)
        TriggerServerEvent('Exit')
    end
    CloseMenu()
end)

-- call back sound
RegisterNuiCallback("sound", function(data, cb)
    if data == 'sound' then
        PlaySoundFrontend(-1, "CONTINUE", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
    elseif data == 'settings' then
        PlaySoundFrontend(-1, "CONTINUE", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
    else
        PlaySoundFrontend(-1, "BACK", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)

    end

end)

-- 