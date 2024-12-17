import json

def generate_coordinates():
    current_code = "ING057"
    initial_code = current_code
    data_list = []

    while True:
        user_input = input("Ingrese las coordenadas (lat, lon) o 'salir' para terminar: ")
        if user_input.lower() == 'salir':
            break

        try:
            lat, lon = map(float, user_input.split(','))
            descripcion = input("Ingrese una descripción: ")
            
            # Generar nueva coordenada
            lat_qr2 = round(lat + 0.00001, 6)
            lon_qr2 = round(lon + 0.00001, 6)

            # Crear el diccionario
            data = {
                "codigo": current_code,
                "latitud_qr1": lat,
                "longitud_qr1": lon,
                "latitud_qr2": lat_qr2,
                "longitud_qr2": lon_qr2,
                "altitud": 0.0,
                "decripcion": descripcion
            }

            data_list.append(data)

            # Incrementar el código
            current_code = f"ING{int(current_code[3:]) + 1:03d}"
        
        except ValueError:
            print("Formato de entrada incorrecto. Intente nuevamente.")

    final_code = f"ING{int(current_code[3:]) - 1:03d}"
    file_name = f"nodos_generados_{initial_code}-{final_code}.json"
    
    with open(file_name, "w") as json_file:
        json.dump(data_list, json_file, indent=4)

    print(f"Archivo generado: {file_name}")

if __name__ == "__main__":
    generate_coordinates()
