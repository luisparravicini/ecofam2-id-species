# Identificador de especies

El identificador de especies es una herramienta desarrollada como parte del proyecto [ECOFAM 2.0](https://www.avesargentinas.org.ar/ecofam-20-0) para ayudar a los voluntarios a reconocer las especies que encuentren en sus recorridos por la costa.


## Uso

Abrir `site/index.html` en un navegador. Se le van presentando varias opciones y preguntas al usuario y a través de las respuestas se van reduciendo el listado de probables especies.

## Fuente de datos

En el caso de querer tomar este repositorio como fuente para una herramienta similar, se detalla el proceso de obtención de datos usado por si se quisiese usar un proceso similar:

* Se usa una planilla con varias hojas
* En cada hoja las filas corresponden a preguntas a hacerle al usuario y cada columna representa una especie
* La celda donde la respuesta es sí, se ingresa un 1
* Se exportan las hojas a formato csv y se dejan en un directorio
* Se corre `mk_data.rb >site/js/data.js`. Este script genera `site/js/data.js` que luego es usado por el identificador.
