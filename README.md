# 2 Julio
1016  pnpm create astro@latest -> named it ./test and without using ts, with only sample files.
1018  cd test -> access the folder
1020  pnpm run dev -> Run the website
1021  pnpm install firebase-admin -> install firebase-admin
1022  pnpm astro add react -> install react 
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


# Integració de Google Auth

Activem la API Google+ en el nostre projecte de Google Cloud.
En l'apartat de "APIs y Servicios" ens dirigim a l'apartat de crendencials
creem unes credenciasl ("ID de cliente de oauth") 
Afegim la uri "https://localhost" ( o la que necessitem en cas de no treballar localment)
Afegim la uri "https://localhost/api/googlAuthenticated.json" en la redirecció en cas de una autenticació correcta.
Ens descarguem el json y el guardem en la ruta src/clientOauth.json
{"web":{"client_id":"764852390513-7om3jfp3o7q06ihd97274tcsk0gvnilp.apps.googleusercontent.com","project_id":"rare-citadel-428216-c5","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["https://localhost/api/googlAuthenticated.json"],"javascript_origins":["https://localhost"]}}

# Google Oauth2 requereix del ús de https i per tant generem el certificat utilitzant mkcert excutant aquest en el directori principal del nostre projecte.
brew install mkcert
mkcert -install
mkcert localhost
# Creem el fitxer server.js
import https from 'node:https';
import fs from 'node:fs';
import { handler } from './dist/server/entry.mjs';

// Adjust paths as necessary for your SSL certificate files
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

https.createServer(options, (req, res) => {
  handler(req, res);
}).listen(3000, () => {
  console.log('HTTPS server running on https://localhost:3000');
});
# A continuació creem l'endpoint per redirigir a l'autenticació de Google en la seguent ruta src/pages/loginGoogle.astro 

---
import { clientOauth } from "@/firebase/config";
const web = clientOauth.web;

const { client_id, redirect_uris } = web;
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uris[0]}&response_type=code&scope=email profile openid`;
return Astro.redirect(authUrl);
---

# A continuació per tal de tractar la resposta que rebem del servidor i autenticar aquest usuari creem src/pages/api/googlAuthenticated.json.ts el qual verifica el token rebut i passa aquest a l'autenticació de Firebase i en cas d'exit redirigeix a la página de account.

import { type APIRoute } from "astro";
import { clientOauth } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const web = clientOauth.web;
        const clientId = web.client_id;
        const clientSecret = web.client_secret;
        const redirectUri = web.redirect_uris[0];
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        console.log('code', code);

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return new Response(JSON.stringify({ error: tokenData.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const idToken = tokenData.id_token;
        const credential = GoogleAuthProvider.credential(idToken);
        const firebaseUser = await signInWithCredential(auth, credential);

        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/account'
            }
        });
    } catch (error) {
        console.error(error);
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/account'
            }
        });
    }
}

# Compilem el nostre projecte
pnpm run build

# Afegim firebase-admin al nostre projecte per tal de realitzar la conexió a la base de dades.
Creem el fitxer serviceAccountKey.json i afegim la clau secreta que obtenim desde la configuració del nostre projecte, després dirigint-nos a comptes de servei i a l'apartat de SDK de Firebase Admin generem la nostra clau secreta.
# Creem el fitxer src/firebase/admin.js on importem i declarem firebase-admin

# Important al canviar el nom de la base de dades de Firestore a un altre cal tenir-hon en compte al inicialitzar la conexió a aquesta ja que sino retorna un error 5 que no es massa ilustratiu.

# Instalem zustand per tal de gestionar el contexte entre els diferents elements. 

# Instalem stripe per tal de gestionar els pagaments
npm install @stripe/react-stripe-js @stripe/stripe-js