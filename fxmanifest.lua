fx_version 'cerulean'         -- Specifies the FXServer version compatibility.
game 'gta5'                   -- Specifies the game (GTA V).
lua54 'yes'                   -- Enables Lua 5.4 features.

author 'John Doe <j.doe@example.com>'  -- Author metadata.
description 'Example resource'         -- Description of the resource.
version '1.0.0'                        -- Version number of the resource.

-- Client-side scripts to be run
client_scripts {
    'client.lua',
}

-- Server-side script
server_script 'server.lua'

-- Scripts shared between client and server
shared_scripts  {
    'Config.lua',
    '@ox_lib/init.lua',
 
}

-- UI page setup for NUI
ui_page 'web/index.html'


files {
    "web/index.html",
    "web/main.js",
    "web/style.css"
}
