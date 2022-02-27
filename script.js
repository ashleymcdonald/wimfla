const layers = {
    qwerty: "qwerty", sym: "symbols", nav: "nav", function: "fn", adjust: "adjust"
}
const holder = document.getElementById('visual-keymap')

const layer = layer => holder.className = 'layer_' + layer

window.electronAPI.layer((event, value) => {
    console.log(value, layers[value])
    layer(layers[value])
})

let scale;

const resize = (adjustment = 0) => {
    if (!scale) scale = Math.min((window.innerWidth - 20) / 738, (window.innerHeight - 20) / 250)
    if (typeof adjustment === 'number') scale += adjustment
    holder.style.transform = 'scale(' + scale + ')'
}

window.onresize = resize;
