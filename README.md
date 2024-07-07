# 2 Julio
1016  pnpm create astro@latest -> named it ./test and without using ts, with only sample files.
1018  cd test -> access the folder
1020  pnpm run dev -> Run the website
1021  pnpm install firebase-admin -> install firebase-admin
1022  pnpm astro add react -> install react 
1023  pnpm astro add astro-icon -> install astro icons ( OPTIONAL )
1024  pnpm astro add node -> install SSR (NODE.JS)

# 06/07/2024 para fer servir @/components/Card.astro per exemple... etc...
En el ficher tsconfig.json añadimos al ComplilerOptions.
````
"CompilerOptions": {
    "baseUrl": ".",
    "paths": {
        "@/*": [
            "src/*"
        ],
        "@/components*": [
            "src/components/*"
        ],
        "@/layouts*": [
            "src/layouts/*"
        ],
    }
}
````
# Idea 1 -> uso de zustand - para el manejo de estados globales. ( Ejemplo de declaración de un estado global)
````
import create from "zustand";

export const setCurrentMusic = create((set) => ({
    isPlaying: false,
    currentMusic: 
    { 
        playlist: null,
        song: null, 
        songs: [],
    },
    setIsPlaying: (isPlaying) => set({isPlaying}), 
    setCurrentMusic: (currentMusic) => set({ currentMusic }),
    })
)
````
# Para usar zustand importamos y luego en component de react hacemos ( En caso de querer sacarlo todo)
const {isPlaying, currentMusic, setIsPlaying, setCurrentMusic } = setCurrentMusic( state => state)
# En caso de querer solo sacar una parte
const {isPlaying, currentMusic, setIsPlaying, setCurrentMusic } = setCurrentMusic( state => {
    isPlaying: state.isPlaying,
    ... y lo mismo para los demas
})
# Crear un endpoint en Astro: ( En la carpeta api creamos un endpoint.js) y mostramos
const async function GET({params, request}){
    const {url} = request;
    const urlObject = new URL(url);
    const params = urlObject.searchParams;
    const id = params.get("id");
    // Hacemos lo que sea
    const playlist = [1,2,3,4]
    const song = {
        name : "jose" 
    }
    // Devolvemos una respuesta
    return new Response(JSON.stringify({
        playlist, song
    }),{
        headers: {
            "content-type" : "application/json" 
        }
    }
    )
}
## Creem els fitcers login.astro i register.astro dintre del directori src 
A continuació afegim els fitxers login.json.ts i register.json.ts dintre del directori api dintre de la carpeta src
# Instalem Firebase 
pnpm install firebase
# Creem la carpeta firebase dintre del directori de src i afegim el fitxer config.js 
Afegim les credencials que hem obtingut de la aplicaicó web que hem creat al nostre projecte de firebase.
afegint l'exportació del firebaseAuth obtingut gràcies a la funció de getAuth que reb com a paramatre l'app de firebase inicialitzada amb la configuració obtinguda previament.
# A continuació afegim l'autenticació per correu electornic dintre de l'apartat de Authentication en el nostre projecte de Firebase.

# Pel fetching de la api que creem per l'autenticació utilitzarem Axios en lloc de fetch ja que es una opció més segura i completa.
pnpm install axios