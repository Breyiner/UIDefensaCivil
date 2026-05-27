const tiempoRelativo = (fecha) => {
    const ahora = new Date();
    const then = new Date(fecha);
    const diff = Math.floor((ahora - then) / 1000); // segundos

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 2592000) return `Hace ${Math.floor(diff / 86400)} días`;
    if (diff < 31536000) return `Hace ${Math.floor(diff / 2592000)} meses`;
    return `Hace ${Math.floor(diff / 31536000)} años`;
};

export default tiempoRelativo;