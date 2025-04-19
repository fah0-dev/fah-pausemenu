$(function () {
    let chcak = [{ lable: "resume", icon: "fa-solid fa-backward" },
    { lable: "settings", icon: "fa-solid fa-gears" },
    { lable: "Map", icon: "fa-solid fa-map" },
    { lable: "Exit", icon: "fa-solid fa-door-open" }
]
let cam = 1
let color = "#ff0000"
console.log("fahadadad")

function loadSettingsFromLocalStorage() {
    if (localStorage.getItem('qb-pausemenu-settings')) {
        const settings = JSON.parse(localStorage.getItem('qb-pausemenu-settings'));
        if (settings.color) color = settings.color;
        if (settings.cam) cam = parseInt(settings.cam);
    }
}
function saveSettingsToLocalStorage() {
    const settings = {
        color: color,
        cam: cam
    };
    localStorage.setItem('qb-pausemenu-settings', JSON.stringify(settings));
}






window.addEventListener("message", function (event) {
    sendpost("typeCam", cam);
    let data = event.data;
    if (data.type == "open") {
        
        
        loadSettingsFromLocalStorage();
        $("#colorPicker").val(color);
        updateColors(color);
        
        
        $("#cameraselection").val(cam.toString());
        
        
        if (cam === 1) {
            $(".menuNotcam").attr("class", "menu");
            $(".nameNotcam").attr("class", "name");
        } else if (cam === 2) {
            $(".menu").attr("class", "menuNotcam");
            $(".name").attr("class", "nameNotcam");
        }
        
        $(".container").fadeIn(500);
        $(".container").css("display", "flex");

        } else if (data.type == "close") {
            
            $(".container").fadeOut(500);
            setTimeout(() => {
                $(".container").css("display", "none");
            }, 500);
        }
    });
    
    window.addEventListener("message", function (event) {
        let data = event.data;
        
        if (data.type == "showImage") {

            $(":root").css("--health", `${data.health - 100}%`);
            $("#health").html(data.health - 100);
            $("#name").html(data.name);
            $("#location").html(data.location);
            if (data.image) {
                $("#imgss").css({
                    "background-image": `url(https://nui-img/${data.image}/${data.image})`,
                });
            }
        }
    })
    
    window.addEventListener("message", function (event) {
        let data = event.data;
        if (data.type == "update") {
            
            
            pauseMenu = $(".info");
            if (cam === 1) {
           
                pauseMenu.css("top", `${event.data.y * window.innerHeight}px`);
                pauseMenu.css("left", `${event.data.x + 0.6 * window.innerWidth}px`);
                
                
            } else if (cam === 2) {
             
                event.data.y = 0.13 + event.data.y;
                pauseMenu.css("top", `${event.data.y * window.innerHeight}px`);
                pauseMenu.css("left", `${event.data.x + 0.58 * window.innerWidth}px`);
            }

            
            
        }
    });
    
    window.addEventListener("message", function (event) {
        let data = event.data;
        if (data.type == "data") {
           
            $("#player-job").html(`<p class='info-text' style='color:rgb(255, 215, 215);'>Job: <span  style='color: #dcdcdc;'>${data.job}</span></p>`);
            $("#player-gang").html(`<p class='info-text' style='color: rgb(255, 215, 215);'>Gang: <span style='color: #dcdcdc;'>${data.gang}</span></p>`);
            $("#player-bank").html(`<p class='info-text' style='color: rgb(255, 215, 215);'>Bank: <span style='color: #dcdcdc;'>${data.bank}</span></p>`);
            $("#player-cash").html(`<p class='info-text' style='color: rgb(255, 215, 215);'>Cash: <span style='color: #dcdcdc;'>${data.cash}</span></p>`);
        }
    });
    
    
    
    $(".button").on("click", function () {
        $(".button").removeClass("active");
        $(this).addClass("active");
        
        
        var index = $(this).index();
        if (index === 0) {
            $(".color").css("display", "flex");
            $(".cam").css("display", "none");
        } else if (index === 1) {
            $(".color").css("display", "none");
            $(".cam").css("display", "flex");
        }
    });
    $(".button").first().addClass("active");
    $(".color").css("display", "flex");
    
    $(".cam").css("display", "none");
    
    
    
    $(".boxfoot").empty();
    chcak.forEach(element => {
        $(".boxfoot").append(`
            <div class="menu" id=${element.lable}>
            <p>${element.lable}</p>
            <div class="icon"><i class="${element.icon}"></i></div>
            </div>
            `);
            $(`#${element.lable}`).on("click", function () {
                console.log(element.lable);
                sendpost("menu", element.lable);
            });
        });
        
        $(".menu").on("click", function () {
     
            saveSettingsToLocalStorage();
            sendpost("close", { cam: cam, color: color });
            sendpost("sound", "sound");
            $(".container").fadeOut(500);
            setTimeout(() => {
                $(".container").css("display", "none");
            }, 500);
        });
        
   
        $(".menuNotcam").on("click", function () {

            saveSettingsToLocalStorage();
            sendpost("close", { cam: cam, color: color });
            sendpost("sound", "sound");
            $(".container").fadeOut(500);
            setTimeout(() => {
                $(".container").css("display", "none");
            }, 500);
        });

    
    $(".settings").click(function () {
        $(".setting").css("display", "flex");
        if ($("#icons").on("click")) {
            $("#icons").click(function () {
                $(".setting").fadeOut(500);
                $(".setting").css("display", "none");
                sendpost("sound", "clocs")

            });
        }
        sendpost("sound", "settings")
    });
    $('#cameraselection').on('change', function () {
        var selectedValue = $(this).val();
        if (selectedValue === "1") {
            $(".menuNotcam").attr("class", "menu");
            $(".nameNotcam").attr("class", "name");
            cam = 1;
        } else if (selectedValue === "2") {
            $(".menu").attr("class", "menuNotcam");
            $(".name").attr("class", "nameNotcam");
            cam = 2;
        }
      
        saveSettingsToLocalStorage();
        sendpost("cam", selectedValue);
        sendpost("typeCam", cam);
    });

    $(".menu, .menuNotcam").on("click", function () {
        sendpost("sound", "sound")
    });

    $('#colorPicker').on('input', function () {
        updateColors($(this).val());
        color = $(this).val();
        saveSettingsToLocalStorage();
    });


    $(document).ready(function () {
      
        loadSettingsFromLocalStorage();
        updateColors($('#colorPicker').val());
    });

// function 
    function hexToRGB(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    function adjustBrightness({ r, g, b }, percent) {
        return {
            r: Math.min(255, Math.max(0, r + r * percent)),
            g: Math.min(255, Math.max(0, g + g * percent)),
            b: Math.min(255, Math.max(0, b + b * percent)),
        };
    }

    function toRGB({ r, g, b }) {
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    function toRGBA({ r, g, b }, a) {
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    }

    function updateColors(hex) {
        const base = hexToRGB(hex);
        const dark = adjustBrightness(base, -0.5);
        const medium = adjustBrightness(base, -0.25);
        const light = base;

        const root = document.documentElement;

        $(root).css('--main-dark', toRGB(dark));
        $(root).css('--main-medium', toRGB(medium));
        $(root).css('--main-light', toRGB(light));

        $(root).css('--shadow-dark', toRGBA(dark, 0.7));
        $(root).css('--shadow-medium', toRGBA(light, 0.3));
        $(root).css('--shadow-light', toRGBA(light, 0.5));

        $(root).css('--glow-dark', `0 0 10px ${toRGBA(dark, 0.7)}`);
        $(root).css('--glow-light', `0 0 15px ${toRGBA(light, 0.8)}`);

        $(root).css('--border-dark', `2px solid ${toRGBA(dark, 0.5)}`);
        $(root).css('--border-light', `2px solid ${toRGBA(light, 0.5)}`);

        $(root).css('--gradient-dark', `linear-gradient(to bottom, ${toRGBA(dark, 0.3)}, transparent)`);
        $(root).css('--gradient-light', `linear-gradient(90deg, transparent, ${toRGBA(light, 0.2)}, transparent)`);
    }


    function sendpost(name, item) {
        $.post(`https://${GetParentResourceName()}/${name}`, JSON.stringify(item));
    }
});





