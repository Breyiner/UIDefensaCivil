export default async () => {
    const botonBack = document.getElementById("botonBack");
    botonBack.onclick = () => {
        history.back();
    };
}