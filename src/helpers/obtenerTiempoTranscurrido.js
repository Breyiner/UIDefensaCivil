//usamos fechabd como parametro el cual va a entregar el campo de created.at que entrega el endpoint
export const obtenerTiempoTranscurrido = (fechaBD) => {
    // si fechaBD no tiene nada nos mostrará un mensaje avisandonos
    if (!fechaBD) return "Fecha no disponible";

    // ya que hay computadoras que no leen correctamente los espacios en blanco hay una norma que nos explica que al agregar la T cualquier dispositivo entendera que esta asociada a una hora
    const fechaISO = fechaBD.replace(" ", "T");
    const fechaCreacion = new Date(fechaISO);
    const ahora = new Date();

    // 3. Cálculo de la diferencia (en milisegundos), esta operacion se puede hacer gracias a la instancia del objeto date; ya que si no se instanciará daria NaN
    const diferenciaMs = ahora - fechaCreacion;

    // 4. Conversiones a unidades que un usuario entienda y con math.floor eliminamos decimales
    const segundos = Math.floor(diferenciaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    // si paso mas de un dia mostrará dia[s]
    if (dias > 0) {
        return `hace ${dias} día${dias > 1 ? 's' : ''}`;
    }
    // si pasó mas de una hora, mostrará hora[s]
    if (horas > 0) {
        return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
    }
    // si pasó mas de un minutos, mostrará minuto[s]
    if (minutos > 0) {
        return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }
    
    //si paso 0 minutos:
    return "recién creado";
};