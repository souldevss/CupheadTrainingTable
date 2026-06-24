const ranks = [
    "WR", "S", "A++", "A+", "A", "A-", "B+", "B", "B-",
    "C+", "C", "C-", "D+", "D", "D-", "E+", "E", "E-", "F"
];

const ranksStyles = [
    { background: "#ffffff", color: "#000000" }, 
    { background: "#252525", color: "#F1C232" }, 
    { background: "#a64d79", color: "#cfe2f3" }, 
    { background: "#ffd966", color: "#000000" }, 
    { background: "#FFE699", color: "#000000" }, 
    { background: "#FFF2CC", color: "#000000" }, 
    { background: "#D9D2E9", color: "#000000" }, 
    { background: "#A2A7FE", color: "#000000" }, 
    { background: "#7980F7", color: "#000000" }, 
    { background: "#9FC5E8", color: "#000000" }, 
    { background: "#84AFE6", color: "#000000" }, 
    { background: "#6C9CE8", color: "#000000" }, 
    { background: "#A0C2C7", color: "#000000" }, 
    { background: "#8CB5BC", color: "#000000" }, 
    { background: "#76A5AF", color: "#000000" }, 
    { background: "#EA9999", color: "#000000" }, 
    { background: "#DD7E6B", color: "#000000" }, 
    { background: "#E06666", color: "#000000" }, 
    { background: "#999999", color: "#000000" }  
];

const totalsRowsStyles = [
    { name: "Inkwell Isle I", background: "#a7c8cf", color: "#20124d" },
    { name: "Inkwell Isle II", background: "#e7ad63", color: "#20124d" },
    { name: "Inkwell Isle III", background: "#8f7dc7", color: "#20124d"},
    { name: "Inkwell Hell", background: "#d64520", color: "#20124d" },
    { name: "Inkwell Isle 1", background: "#a7c8cf", color: "#20124d" },
    { name: "Inkwell Isle 4", background: "#74b9b0", color: "#20124d" },
    { name: "DLC Category", background: "#74b9b0", color: "#20124d" },
    { name: "Residual", background: "#999999", color: "#20124d" },
    { name: "Sob", background: "#f1c232", color: "#674ea7" }
];

const islands = [
{
    name: "Inkwell Isle I",
    color: "#a7c8cf",
    textcolor: "#20124d",
    levels: [
        { name: "Forest Follies", icon: "https://myekul.com/shared-assets/cuphead/images/runnguns/forestfollies.png", background: "#95BC7A", color: "#000000", times: [31.9,32.57,33.24,33.92,34.59,35.26,35.93,36.61,37.28,37.95,38.62,39.29,39.97,40.64,41.31,41.98,42.66,43.33,44] },
        { name: "The Root Pack", icon: "https://myekul.com/shared-assets/cuphead/images/therootpack.png", background: "#DDA13A", color: "#000000", times: [33.81,34.4,35,35.59,36.19,36.78,37.37,37.97,38.56,39.16,39.75,40.34,40.94,41.53,42.12,42.72,43.31,43.91,44.5] },
        { name: "Ribby & Croaks", icon: "https://myekul.com/shared-assets/cuphead/images/ribbyandcroaks.png", background: "#8A8600", color: "#FFFFFF", times: [39.99,41.49,42.99,44.49,45.99,47.49,48.99,50.49,51.99,53.5,55,56.5,58,59.5,61,62.5,64,65.5,67] },
        { name: "Goopy Le Grande", icon: "https://myekul.com/shared-assets/cuphead/images/goopylegrande.png", background: "#5A88D8", color: "#000000", times: [21.86,22.92,23.99,25.05,26.11,27.18,28.24,29.3,30.37,31.43,32.49,33.56,34.62,35.68,36.75,37.81,38.87,39.94,41] },
        { name: "Hilda Berg", icon: "https://myekul.com/shared-assets/cuphead/images/hildaberg.png", background: "#B12A2A", color: "#FFD700", times: [59.55,61.07,62.6,64.12,65.65,67.17,68.7,70.22,71.75,73.28,74.8,76.33,77.85,79.38,80.9,82.42,83.95,85.47,87] },
        { name: "Cagney Carnation", icon: "https://myekul.com/shared-assets/cuphead/images/cagneycarnation.png", background: "#FFA500", color: "#000000", times: [30.4,31.52,32.63,33.75,34.87,35.98,37.1,38.22,39.33,40.45,41.57,42.68,43.8,44.92,46.03,47.15,48.27,49.38,50.5] }
    ]
},
{
    name: "Inkwell Isle II",
    color: "#e7ad63",
    textcolor: "#20124d",
    levels: [
        { name: "Baroness Von Bon Bon", icon: "https://myekul.com/shared-assets/cuphead/images/baronessvonbonbon.png", background: "#F57AB3", color: "#FFFFFF", times: [29.87,31.38,32.88,34.39,35.9,37.41,38.91,40.42,41.93,43.44,44.94,46.45,47.96,49.46,50.97,52.48,53.99,55.49,57] },
        { name: "Wally Warbles", icon: "https://myekul.com/shared-assets/cuphead/images/wallywarbles.png", background: "#0000CC", color: "#FFFFFF", times: [46.44,47.69,48.95,50.2,51.45,52.71,53.96,55.21,56.47,57.72,58.97,60.23,61.48,62.73,63.99,65.24,66.49,67.75,69] },
        { name: "Djimmi The Great", icon: "https://myekul.com/shared-assets/cuphead/images/djimmithegreat.png", background: "#C85D5D", color: "#4FFFD0", times: [74.96,75.91,76.85,77.8,78.75,79.69,80.64,81.59,82.53,83.48,84.43,85.37,86.32,87.27,88.21,89.16,90.11,91.05,92] },
        { name: "Beppi The Clown", icon: "https://myekul.com/shared-assets/cuphead/images/beppitheclown.png", background: "#A61919", color: "#FFFFFF", times: [36.88,38.89,40.89,42.9,44.91,46.91,48.92,50.93,52.93,54.94,56.95,58.95,60.96,62.97,64.97,66.98,68.99,70.99,73] },
        { name: "Grim Matchstick", icon: "https://myekul.com/shared-assets/cuphead/images/grimmatchstick.png", background: "#9ACD32", color: "#000000", times: [44.64,45.99,47.35,48.7,50.05,51.41,52.76,54.11,55.47,56.82,58.17,59.53,60.88,62.23,63.59,64.94,66.29,67.65,69] }
    ]
},
{
    name: "Inkwell Isle III",
    color: "#8f7dc7",
    textcolor: "#20124d",
    levels: [
        { name: "Rumor Honeybottoms", icon: "https://myekul.com/shared-assets/cuphead/images/rumorhoneybottoms.png", background: "#F4C430", color: "#000000", times: [37.01,38.65,40.29,41.92,43.56,45.2,46.84,48.48,50.12,51.75,53.39,55.03,56.67,58.31,59.95,61.59,63.22,64.86,66.5] },
        { name: "Dr. Kahl's Robot", icon: "https://myekul.com/shared-assets/cuphead/images/drkahlsrobot.png", background: "#B0B0B0", color: "#000000", times: [40.9,42.38,43.86,45.33,46.81,48.29,49.77,51.24,52.72,54.2,55.68,57.16,58.63,60.11,61.59,63.07,64.54,66.02,67.5] },
        { name: "Sally Stageplay", icon: "https://myekul.com/shared-assets/cuphead/images/sallystageplay.png", background: "#2FB3B3", color: "#000000", times: [43.69,45.07,46.45,47.82,49.2,50.58,51.96,53.34,54.72,56.09,57.47,58.85,60.23,61.61,62.99,64.36,65.74,67.12,68.5] },
        { name: "Werner Werman", icon: "https://myekul.com/shared-assets/cuphead/images/wernerwerman.png", background: "#A65628", color: "#FFFFFF", times: [34.17,35.91,37.65,39.39,41.13,42.87,44.61,46.35,48.09,49.84,51.58,53.32,55.06,56.8,58.54,60.28,62.02,63.76,65.5] },
        { name: "Captain Brineybeard", icon: "https://myekul.com/shared-assets/cuphead/images/captainbrineybeard.png", background: "#E11D48", color: "#FFFFFF", times: [36.45,38.09,39.73,41.38,43.02,44.66,46.3,47.94,49.58,51.23,52.87,54.51,56.15,57.79,59.43,61.08,62.72,64.36,66] },
        { name: "Cala Maria", icon: "https://myekul.com/shared-assets/cuphead/images/calamaria.png", background: "#9AD0B3", color: "#4A3B69", times: [50.15,51.67,53.19,54.71,56.23,57.75,59.27,60.79,62.31,63.83,65.34,66.86,68.38,69.9,71.42,72.94,74.46,75.98,77.5] },
        { name: "Phantom Express", icon: "https://myekul.com/shared-assets/cuphead/images/phantomexpress.png", background: "#9370DB", color: "#FFFFFF", times: [56.64,58.66,60.68,62.7,64.72,66.74,68.76,70.78,72.8,74.82,76.84,78.86,80.88,82.9,84.92,86.94,88.96,90.98,93] }
    ]
},
{
    name: "Inkwell Hell",
    color: "#d64520",
    textcolor: "#20124d",
    levels: [
        { name: "King Dice", icon: "https://myekul.com/shared-assets/cuphead/images/kingdice.png", background: "#8A2BE2", color: "#FFFFFF", times: [102.82,105,107.17,109.35,111.53,113.7,115.88,118.06,120.23,122.41,124.59,126.76,128.94,131.12,133.29,135.47,137.65,139.82,142] },
        { name: "The Devil", icon: "https://myekul.com/shared-assets/cuphead/images/thedevil.png", background: "#000000", color: "#FFCC00", times: [38.79,41.5,44.2,46.91,49.61,52.32,55.03,57.73,60.44,63.14,65.85,68.56,71.26,73.97,76.68,79.38,82.09,84.79,87.5] }
    ]
}
];

const dlcIslands = [
{
    name: "Inkwell Isle 1",
    color: "#a7c8cf",
    textcolor: "#20124d",
    levels: [
        { name: "Forest Follies", icon: "https://myekul.com/shared-assets/cuphead/images/runnguns/forestfollies.png", background: "#95BC7A", color: "#000000", times: [33.35,34,34.65,35.3,35.95,36.6,37.25,37.9,38.55,39.2,39.85,40.5,41.15,41.8,42.45,43.1,43.75,44.4,45] },
        { name: "Mausoleum", icon:"https://myekul.com/shared-assets/cuphead/images/other/mausoleum.png", background: "#6b5f8f", color: "#ffffff", times: [47.42,47.62,47.82,48.02,48.22,48.42,48.62,48.82,49.02,49.22,49.42,49.62,49.82,50.02,50.22,50.42,50.62,50.82,51] }
    ]
},
{
    name: "Inkwell Isle 4",
    color: "#74b9b0",
    textcolor: "#20124d",
    levels: [
        { name: "Glumstone The Giant", icon: "https://myekul.com/shared-assets/cuphead/images/glumstonethegiant.png", background: "#DEB887", color: "#000000", times: [45.44,46.25,47.06,47.87,48.68,49.49,50.3,51.11,51.92,52.73,53.54,54.35,55.16,55.97,56.78,57.59,58.4,59.21,60] },
        { name: "Mortimer Freeze", icon: "https://myekul.com/shared-assets/cuphead/images/mortimerfreeze.png", background: "#9400D3", color: "#00ced1", times: [39.9,41.02,42.14,43.26,44.38,45.5,46.62,47.74,48.86,49.98,51.1,52.22,53.34,54.46,55.58,56.7,57.82,58.94,60] },
        { name: "The Howling Aces", icon: "https://myekul.com/shared-assets/cuphead/images/thehowlingaces.png", background: "#DAA520", color: "#dc143c", times: [43.63,44.82,46.01,47.2,48.39,49.58,50.77,51.96,53.15,54.34,55.53,56.72,57.91,59.1,60.29,61.48,62.67,63.86,65.05] },
        { name: "Esther Winchester", icon: "https://myekul.com/shared-assets/cuphead/images/estherwinchester.png", background: "#D2691E", color: "#ffcf10", times: [58.98,59.87,60.76,61.65,62.54,63.43,64.32,65.21,66.1,66.99,67.88,68.77,69.66,70.55,71.44,72.33,73.22,74.11,75] },
        { name: "Moonshine Mob", icon: "https://myekul.com/shared-assets/cuphead/images/moonshinemob.png", background: "#008080", color: "#ffcf10", times: [34.5,35.81,37.12,38.43,39.74,41.05,42.36,43.67,44.98,46.29,47.6,48.91,50.22,51.53,52.84,54.15,55.46,56.77,58.08] },
        { name: "Chef Saltbaker", icon: "https://myekul.com/shared-assets/cuphead/images/chefsaltbaker.png", background: "#D3D3D3", color: "#000000", times: [49.76,52.83,55.9,58.97,62.04,65.11,68.18,71.25,74.32,77.39,80.46,83.53,86.6,89.67,92.74,95.81,98.88,101.95,105.02] }
    ]
}
];

const version11Residual = [
    661.65, 664.89, 668.13, 671.37, 674.61, 677.85, 681.09, 684.33, 687.57,
    690.81, 694.05, 697.29, 700.53, 703.77, 707.01, 710.25, 713.49, 716.73, 720
];

const dlcResidual = [
    250.83, 251.34, 251.85, 252.36, 252.87, 253.38, 253.89, 254.4, 254.91,
    255.42, 255.93, 256.44, 256.95, 257.46, 257.97, 258.48, 258.99, 259.5, 260.01
];

const dlcSob = [
    603.81, 613.56, 623.31, 633.06, 642.81, 652.56, 662.31, 672.06, 681.81,
    691.56, 701.31, 711.06, 720.81, 730.56, 740.31, 750.06, 759.81, 769.56, 779
];

const chargeDlcIslands = [
{
    name: "Inkwell Isle 1",
    color: "#a7c8cf",
    textcolor: "#20124d",
    levels: [
        { name: "Forest Follies", icon: "https://myekul.com/shared-assets/cuphead/images/runnguns/forestfollies.png", background: "#95BC7A", color: "#000000", times: [33.53,34.17,34.8,35.44,36.08,36.72,37.35,37.99,38.63,39.27,39.9,40.54,41.18,41.81,42.45,43.09,43.73,44.36,45] },
        { name: "Mausoleum", icon:"https://myekul.com/shared-assets/cuphead/images/other/mausoleum.png", background: "#6b5f8f", color: "#ffffff", times: [47.42,47.62,47.82,48.02,48.22,48.41,48.61,48.81,49.01,49.21,49.41,49.61,49.81,50.01,50.2,50.4,50.6,50.8,51] }
    ]
},
{
    name: "Inkwell Isle 4",
    color: "#74b9b0",
    textcolor: "#20124d",
    levels: [
        { name: "Glumstone The Giant", icon: "https://myekul.com/shared-assets/cuphead/images/glumstonethegiant.png", background: "#DEB887", color: "#000000", times: [46.25,47.01,47.78,48.54,49.31,50.07,50.83,51.6,52.36,53.13,53.89,54.65,55.42,56.18,56.94,57.71,58.47,59.24,60] },
        { name: "Mortimer Freeze", icon: "https://myekul.com/shared-assets/cuphead/images/mortimerfreeze.png", background: "#9400D3", color: "#00ced1", times: [38.15,39.09,40.02,40.96,41.89,42.83,43.77,44.7,45.64,46.58,47.51,48.45,49.38,50.32,51.26,52.19,53.13,54.06,55] },
        { name: "The Howling Aces", icon: "https://myekul.com/shared-assets/cuphead/images/thehowlingaces.png", background: "#DAA520", color: "#dc143c", times: [42.26,43.53,44.79,46.06,47.32,48.59,49.86,51.12,52.39,53.66,54.92,56.19,57.45,58.72,59.99,61.25,62.52,63.78,65.05] },
        { name: "Esther Winchester", icon: "https://myekul.com/shared-assets/cuphead/images/estherwinchester.png", background: "#D2691E", color: "#ffcf10", times: [58.98,59.87,60.76,61.65,62.54,63.43,64.32,65.21,66.1,66.99,67.88,68.77,69.66,70.55,71.44,72.33,73.22,74.11,75] },
        { name: "Moonshine Mob", icon: "https://myekul.com/shared-assets/cuphead/images/moonshinemob.png", background: "#008080", color: "#ffcf10", times: [36.61,37.8,39,40.19,41.38,42.57,43.77,44.96,46.15,47.35,48.54,49.73,50.92,52.12,53.31,54.5,55.69,56.89,58.08] },
        { name: "Chef Saltbaker", icon: "https://myekul.com/shared-assets/cuphead/images/chefsaltbaker.png", background: "#D3D3D3", color: "#000000", times: [50.24,52.73,55.21,57.7,60.19,62.67,65.16,67.65,70.13,72.62,75.11,77.59,80.08,82.57,85.05,87.54,90.03,92.51,95] }
    ]
}
];

const chargeDlcResidual = [
    263.32, 263.97, 264.62, 265.27, 265.92, 266.56, 267.21, 267.86, 268.51,
    269.16, 269.81, 270.46, 271.11, 271.76, 272.4, 273.05, 273.7, 274.35, 275
];

const chargeDlcSob = [
    616.76, 625.78, 634.8, 643.82, 652.84, 661.86, 670.88, 679.9, 688.92,
    697.95, 706.97, 715.99, 725.01, 734.03, 743.05, 752.07, 761.09, 770.11, 779.13
];

const speedrunCategories = [
    {
        id: "version-1-1",
        label: "1.1",
        title: "Game Version 1.1",
        islands,
        residual: version11Residual
    },
    {
        id: "version-DLC",
        label: "DLC",
        title: "DLC Table",
        subOptions: [
            {
                id: "lobber",
                label: "Lobber",
                icon: "https://myekul.com/shared-assets/cuphead/images/inventory/weapon/lobber.png",
                islands: dlcIslands,
                residual: dlcResidual,
                sob: dlcSob
            },
            {
                id: "charge",
                label: "Charge",
                icon: "https://myekul.com/shared-assets/cuphead/images/inventory/weapon/charge.png",
                islands: chargeDlcIslands,
                residual: chargeDlcResidual,
                sob: chargeDlcSob
            }
        ]
    }
];
