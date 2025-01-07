import bcrypt from "bcryptjs";
import prompts from "prompts";

// función para leer imput con el paquete prompts
// function to read inputs with the prompts package
const read = async (message) => {
    const response = await prompts({
        type: "text", // Tipo de entrada: texto / Input type: text
        name: "name", // Nombre de la propiedad que se devuelve / Property name returned
        message: message, // Mensaje mostrado al usuario / Message displayed to the user
        validate: (value) => (value ? true : "Input cannot be empty"), // Validación: el campo no puede estar vacío / Validation: field cannot be empty
    });

    return response.name; // Retorna el valor ingresado / Returns the entered value
};

// función principal
// main function
(async () => {
    let cerrar; // Variable para controlar si el usuario quiere salir o continuar
    // Variable to control if the user wants to exit or continue

    // bucle principal para hacer varias veces los hashes o comparaciones
    // main loop to perform hashes or comparisons multiple times
    do {
        console.log("> What do you want to do?");
        console.log("> 1) Create a hash");
        console.log("> 2) Compare a hash");

        let cerrar2 = 0; // Variable para el control de las opciones del menú
        // Variable for menu option control

        // bucle que comprueba si se ingresaron bien las opciones
        // loop that checks if the options were entered correctly
        do {
            const opt = parseInt(await read("Choose an option: ")); // Leer la opción del usuario / Read user option
            if (isNaN(opt)) {
                console.log("Invalid input. Please enter a valid number.");
                continue; // Si no es un número, pide la entrada nuevamente / If not a number, ask for input again
            }

            if (opt === 1) {
                // Crear un hash
                // Create a hash
                const texto = await read("Enter the text to hash: "); // Leer texto para hashear / Read text to hash
                let costFactor; // Factor de costo (número de vueltas) / Cost factor (number of rounds)
                let cerrar3;

                // bucle para poner el costo (cantidad de vueltas)
                // loop to set the cost factor (number of rounds)
                do {
                    cerrar3 = 1; // Salir del bucle si la entrada es válida / Exit loop if input is valid
                    const tempCost = parseInt(await read("Enter the cost factor (between 1 and 14): "));
                    if (tempCost > 0 && tempCost < 15) {
                        costFactor = tempCost; // Guardar el factor de costo válido / Save valid cost factor
                    } else {
                        console.log("The number should be between 1 and 14");
                        cerrar3 = 3; // Volver a pedir el factor de costo / Ask for cost factor again
                    }
                } while (cerrar3 === 3);

                console.log(bcrypt.hashSync(texto, costFactor)); // Generar y mostrar el hash / Generate and display the hash
                cerrar2 = 2; // Salir del bucle interno después de hashear / Exit inner loop after hashing
            } else if (opt === 2) {
                // Comparar un hash
                // Compare a hash
                const texto = await read("Enter the text to compare: "); // Leer texto para comparar / Read text to compare
                const hash = await read("Enter the hash: "); // Leer el hash para comparar / Read hash to compare
                console.log(bcrypt.compareSync(texto, hash) ? "correct" : "incorrect"); // Mostrar si coinciden o no / Display if they match
                cerrar2 = 2; // Salir del bucle interno después de comparar / Exit inner loop after comparison
            } else {
                console.log("Please choose 1 or 2"); // Mensaje para opción inválida / Message for invalid option
                cerrar2 = 0; // Volver a pedir la opción / Ask for option again
            }
        } while (cerrar2 === 0);

        // Preguntar si se desea continuar
        // Ask if the user wants to continue
        cerrar = parseInt(await read("Do you want to continue? (1 for Yes, 2 for No): "));
        if (![1, 2].includes(cerrar)) {
            console.log("I'll assume you want to exit."); // Mensaje si la entrada no es válida / Message if input is invalid
            cerrar = 2; // Asume que el usuario desea salir / Assume the user wants to exit
        }
    } while (cerrar === 1); // Continuar si el usuario elige 1 / Continue if the user chooses 1
})();


