Repositorio de Bryan Herrera para el Bootcamp de Fullstack de Neoland

En este respositorio se aplican los conocimientos adquiridos durante el curso:
## Descripcion

La aplicacion consiste en una pagina de muestra de eventos de baile social e interactividad entre usuarios de los mismos. Los  usuarios son capaces de registrarse y usar estas credenciales para entrar en la pagina web y desbloquear la opcion de crear eventos, editarlos, y guardarlos en favoritos para verlos en su perfil. Tambien pueden seguirse entre ellos y enviarse mensajes. Tienen la opcion de valorar a otros usuarios y promotores de eventos dependiendo de su experiencia con ellos y asi hacer un ranking de quien es un buen bailarin y que eventos son buenos.

Puedes visitar la aplicacion desplegada en :[Dancing Echange]


*HTML
*CSS (Responsive)
*JavaScript

....

## Dependencias de la aplicacion 

*Node > 20.0.0
*Express 
*MongoDB

## Plugins de VS recomendados 

* Links al pluggin 

....

## Instalacion y ejecucion 

 ```bash
npm install
```

 ```bash
npm run server:express:start
```

Ejecutar en el terminal el servidor backend

Una vez en ejecucion, podemos acceder al front end de la aplicacion en [] y al backend en []

La configuracion de los puertos esta definida en el archivo .env, no incluido en el repositorio de git.

Se usa una copia en el LocalStorage para agilizar el tratamiento de datos y una simulacion en OAuth para gestionar el login de usuario, almacenando la informacion del usuario identificado en SessionStorage bloqueando el uso de algunas features si el usuario no esta identitficado.

## Documentacion 

Para generar la documentacion de la aplicacion se usa[JSDoc] y se guarda en la carpeta ```out```. Para verla puedes ejecutar el comando ```npm run builds:docs```
 
## Modelo de datos y relacion entre componentes 

(Obsidian visual representation of the connection between components)

Explicar el tipado de datos con JSDoc y la validacion con [ESLint] y los hooks de Git.

### pre-commit

Integramos lint-staged para ejectuar validaciones antes de ejecutar el commit.

```bash
#!/usr/bin/env sh

echo PRE-PUSH  GIT HOOK
npm lint staged

```

### pre-push

Integramos el testeo unitario con [Jest]

```bash
#!/usr/bin/env sh

echo PRE-PUSH  GIT HOOK
npm run test

```