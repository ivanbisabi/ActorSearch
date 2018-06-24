$(function () { // Esecuzione solo quando il DOM della pagina è pronto: https://api.$.com/$/#$3

  var apiKey = "855d0f27ac90850576cebfa7bc46b9f6",
      searchInput = $("#actor-name"), // Campo di input
      searchButton = $("#actor-search"),
      container = $("#movies-container"); // Selezione del container mediante selettore: https://api.$.com/$/#$-selector-context

  container.masonry(); // Inizializzo la masonry vuota: https://masonry.desandro.com/

  searchButton.click(function (e) { // Callback al click sul pulsante di ricerca

    var actorName = searchInput.val(); // Estrazione del valore del campo di input dal container: https://api.$.com/data/#data2

    if (!actorName) return; // Se la stringa di ricerca e vuota, non fare nulla

    $.getJSON( // Chiamata AJAX con risposta di tipo JSON: https://api.$.com/$.getJSON/
      "https://api.themoviedb.org/3/search/person", // Url dell'API per la ricerca degli attori
      {
        "api_key": apiKey,
        "query": actorName
      },
      function (actors) { // Funzione di callback, eseguita dopo aver ricevuto la risposta

        var actor = actors.results[0],
            actorId = actor.id; // Id interno dell'attore cercato (primo risultato)

        container.empty(); // Svuoto il contenitore
        container.masonry("destroy"); // Deinizializzo la masonry

        console.log("Actor", actor);
        $("#actor-title").text(actor.name); // Scrivo il nome dell'attore nel titolo
        $("#help").remove(); // Rimuovo il testo di help

        $( // Costruzione di un template HTML con i dati dell'API
          [
            '<div id="actor-' + actor.id + '" class="col-lg-3 col-md-4 col-sm-6 portfolio-item">', // Id univoco dall'id dell'attore
            '  <div class="card h-100">',
            '    <a href="https://www.themoviedb.org/person/' + actor.id + '" target="_blank"><img class="card-img-top" src="https://image.tmdb.org/t/p/w500' + actor.profile_path + '" alt=""></a>',
            '  </div>',
            '</div>'
          ].join("\n") // Metodo join di un array di stringhe, il risultato è una stringa HTML
        ).appendTo(container); // Il nuovo elemento <article> è inserito nel contenitore

        $.getJSON( // Seconda chiamata AJAX
          "https://api.themoviedb.org/3/discover/movie", // Url dell'API per la ricerca dei film per attore
          {
            "api_key": apiKey,
            "with_cast": actorId,
            "sort_by": "release_date.desc", // Dal più recente al più vecchio per data di uscita
            "language": "it-IT" // Sinossi in lingua italiana (se disponibili)
          },
          function (movies) {

            var lastMovies = 12;

            console.log("Movies", movies);

            movies.results.slice(0, lastMovies).forEach(function (movie) { // Ciclo sui primi 12 film

              $( // Costruzione di un template HTML con i dati dell'API
                [
                  '<div id="movie-' + movie.id + '" class="col-lg-3 col-md-4 col-sm-6 portfolio-item">', // Id univoco dall'id del film
                  '  <div class="card h-100">',
                  '    <a href="https://www.themoviedb.org/movie/' + movie.id + '" target="_blank"><img class="card-img-top" src="' + (movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : "http://placehold.it/700x400") + '" alt=""></a>',
                  '    <div class="card-body">',
                  '      <h6><small><time class="entry-date published" datetime="' + movie.release_date + '">' + movie.release_date + '</time></small></h6>',
                  '      <h4 class="card-title">',
                  '        <a href="https://www.themoviedb.org/movie/' + movie.id + '" target="_blank">' + movie.original_title + '</a>',
                  '      </h4>',
                  '      <p class="card-text">' + (movie.overview || 'Sinossi non disponibile in italiano, <a href="#" class="load-original" data-movie-id="' + movie.id + '">vuoi leggere la versione originale?</a>') + '</p>',
                  '    </div>',
                  '  </div>',
                  '</div>'
                ].join("\n") // Metodo join di un array di stringhe, il risultato è una stringa HTML
              ).appendTo(container); // Il nuovo elemento <article> è inserito nel contenitore

            });

            container.imagesLoaded(function () { // Aspetto che tutte le immagini siano caricate: https://imagesloaded.desandro.com/
              container.masonry({ // Inizializzo la masonry
                itemSelector: ".portfolio-item"
              });
            });

            container.find(".load-original").click(function (e) { // Intercetta il click su tutti i tag <a> delle descrizioni mancanti: https://api.$.com/click/#click-handler

              var clickedElement = $(this), // Il tag <a> cliccato
                overviewContainer = clickedElement.parent(), // Il tag <p> che contiene il tag <a> cliccato
                movieId = clickedElement.data('movie-id'); // L'id del film a cui si riferisce il tag <a> cliccato (dall'attributo data-movie-id)

              overviewContainer.text("Loading..."); // Sostituzione del testo con un messaggio di loading: http://api.$.com/text/#text2

              $.getJSON( // Terza chiamata AJAX per ottenere i dettagli del film cliccato
                "https://api.themoviedb.org/3/movie/" + movieId, // Url dell'API per i dettagli di un film
                {
                  "api_key": apiKey,
                },
                function (movie) { // Funzione di callback
                  overviewContainer.text(movie.overview || "Non disponibile."); // Sostituzione del testo con quello della sinossi in lingua originale
                  container.masonry(); // Riattivo la masonry per riarrangiare le card
                }
              );

              e.preventDefault(); // Preveniamo il comportamento di default del click su un tag <a>: https://api.$.com/event.preventdefault/

            });
          }
        );
      }
    );
  });



});