// MULTIBOOST - ENTRENAMIENTO DE MULTIPLICACIONES
// Versión Compatible con limpieza automática

function MultiBoost() {
    // Estado de la aplicación
    this.currentScreen = 'welcome';
    this.selectedTables = [];
    this.exerciseCount = 10;
    this.currentExercise = 0;
    this.exercises = [];
    this.answers = [];
    this.timer = null;
    this.timeLeft = 10;
    this.totalTime = 0;
    this.sessionStartTime = null;
    this.sessionTimer = null;
    
    // Estadísticas
    this.stats = {
        correct: 0,
        incorrect: 0,
        mistakes: []
    };

    // Inicializar la aplicación
    this.init();
}

// Inicialización
MultiBoost.prototype.init = function() {
    var self = this;
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            self.bindEvents();
            self.showScreen('welcome');
            console.log('🚀 MultiBoost iniciado correctamente');
        });
    } else {
        this.bindEvents();
        this.showScreen('welcome');
        console.log('🚀 MultiBoost iniciado correctamente');
    }
};

// Vincular eventos de los botones
MultiBoost.prototype.bindEvents = function() {
    var self = this;

    // Validar que los elementos existen
    try {
        // Botón de inicio
        var startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                self.showScreen('config');
            });
        }

        // Botones de selección de tablas
        var tableBtns = document.querySelectorAll('.table-btn');
        for (var i = 0; i < tableBtns.length; i++) {
            tableBtns[i].addEventListener('click', function(e) {
                self.toggleTable(e.target || e.srcElement);
            });
        }

        // Botones rápidos
        var selectAllBtn = document.getElementById('select-all-btn');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function() {
                self.selectAllTables();
            });
        }

        var clearAllBtn = document.getElementById('clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function() {
                self.clearAllTables();
            });
        }

        var surpriseBtn = document.getElementById('surprise-btn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', function() {
                self.surpriseSelection();
            });
        }

        // Botones de cantidad de ejercicios
        var exerciseBtns = document.querySelectorAll('.exercise-btn');
        for (var i = 0; i < exerciseBtns.length; i++) {
            exerciseBtns[i].addEventListener('click', function(e) {
                self.selectExerciseCount(e.target || e.srcElement);
            });
        }

        // Botón iniciar entrenamiento
        var startTrainingBtn = document.getElementById('start-training-btn');
        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', function() {
                self.startTraining();
            });
        }

        // Botones de opciones en ejercicios
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].addEventListener('click', function(e) {
                self.selectAnswer(e.target || e.srcElement);
            });
        }

        // Botones de resultados
        var repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            repeatBtn.addEventListener('click', function() {
                self.repeatTraining();
            });
        }

        var newTrainingBtn = document.getElementById('new-training-btn');
        if (newTrainingBtn) {
            newTrainingBtn.addEventListener('click', function() {
                self.newTraining();
            });
        }

    } catch (error) {
        console.log('Error vinculando eventos:', error);
    }
};

// Mostrar pantalla específica
MultiBoost.prototype.showScreen = function(screenName) {
    try {
        // Ocultar todas las pantallas
        var screens = document.querySelectorAll('.screen');
        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }

        // Mostrar la pantalla solicitada
        var targetScreen = document.getElementById(screenName + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('📺 Mostrando pantalla: ' + screenName);
        }
    } catch (error) {
        console.log('Error mostrando pantalla:', error);
    }
};

// CONFIGURACIÓN - Seleccionar/deseleccionar tabla
MultiBoost.prototype.toggleTable = function(btn) {
    try {
        var table = parseInt(btn.getAttribute('data-table'));
        
        if (btn.classList.contains('selected')) {
            // Deseleccionar
            btn.classList.remove('selected');
            this.selectedTables = this.selectedTables.filter(function(t) {
                return t !== table;
            });
        } else {
            // Seleccionar
            btn.classList.add('selected');
            this.selectedTables.push(table);
        }

        this.updateStartButton();
        console.log('📊 Tablas seleccionadas:', this.selectedTables);
    } catch (error) {
        console.log('Error seleccionando tabla:', error);
    }
};

// Seleccionar todas las tablas
MultiBoost.prototype.selectAllTables = function() {
    try {
        var tableBtns = document.querySelectorAll('.table-btn');
        for (var i = 0; i < tableBtns.length; i++) {
            tableBtns[i].classList.add('selected');
        }
        this.selectedTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.updateStartButton();
        console.log('✅ Todas las tablas seleccionadas');
    } catch (error) {
        console.log('Error seleccionando todas las tablas:', error);
    }
};

// Limpiar selección de tablas
MultiBoost.prototype.clearAllTables = function() {
    try {
        var tableBtns = document.querySelectorAll('.table-btn');
        for (var i = 0; i < tableBtns.length; i++) {
            tableBtns[i].classList.remove('selected');
        }
        this.selectedTables = [];
        this.updateStartButton();
        console.log('❌ Tablas deseleccionadas');
    } catch (error) {
        console.log('Error deseleccionando tablas:', error);
    }
};

// Selección sorpresa
MultiBoost.prototype.surpriseSelection = function() {
    try {
        this.clearAllTables();
        
        var allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        var surpriseCount = Math.floor(Math.random() * 3) + 1;
        
        for (var i = 0; i < surpriseCount; i++) {
            var randomIndex = Math.floor(Math.random() * allTables.length);
            var randomTable = allTables.splice(randomIndex, 1)[0];
            
            this.selectedTables.push(randomTable);
            var btn = document.querySelector('[data-table="' + randomTable + '"]');
            if (btn) {
                btn.classList.add('selected');
            }
        }
        
        this.updateStartButton();
        console.log('🎲 Selección sorpresa:', this.selectedTables);
    } catch (error) {
        console.log('Error en selección sorpresa:', error);
    }
};

// Seleccionar cantidad de ejercicios
MultiBoost.prototype.selectExerciseCount = function(btn) {
    try {
        var exerciseBtns = document.querySelectorAll('.exercise-btn');
        for (var i = 0; i < exerciseBtns.length; i++) {
            exerciseBtns[i].classList.remove('active');
        }
        
        btn.classList.add('active');
        this.exerciseCount = parseInt(btn.getAttribute('data-count'));
        
        console.log('🎯 Ejercicios seleccionados:', this.exerciseCount);
    } catch (error) {
        console.log('Error seleccionando ejercicios:', error);
    }
};

// Actualizar estado del botón de inicio
MultiBoost.prototype.updateStartButton = function() {
    try {
        var startBtn = document.getElementById('start-training-btn');
        if (!startBtn) return;
        
        if (this.selectedTables.length > 0) {
            startBtn.disabled = false;
            startBtn.textContent = '💪 ¡INICIAR ENTRENAMIENTO!';
        } else {
            startBtn.disabled = true;
            startBtn.textContent = '⚠️ Selecciona al menos una tabla';
        }
    } catch (error) {
        console.log('Error actualizando botón:', error);
    }
};

// ENTRENAMIENTO - Iniciar sesión de ejercicios
MultiBoost.prototype.startTraining = function() {
    try {
        console.log('🚀 Iniciando entrenamiento...');
        console.log('📊 Tablas:', this.selectedTables);
        console.log('🎯 Ejercicios:', this.exerciseCount);

        // LIMPIEZA AUTOMÁTICA ANTES DE EMPEZAR
        this.cleanupSession();
        
        this.resetStats();
        this.generateExercises();
        
        this.sessionStartTime = new Date().getTime();
        this.startSessionTimer();
        
        this.currentExercise = 0;
        this.showNextExercise();
        this.showScreen('exercise');
    } catch (error) {
        console.log('Error iniciando entrenamiento:', error);
    }
};

// Generar ejercicios
MultiBoost.prototype.generateExercises = function() {
    try {
        this.exercises = [];
        
        for (var i = 0; i < this.exerciseCount; i++) {
            var table = this.selectedTables[Math.floor(Math.random() * this.selectedTables.length)];
            var multiplicand = Math.floor(Math.random() * 10) + 1;
            
            var exercise = {
                table: table,
                multiplicand: multiplicand,
                question: table + ' × ' + multiplicand + ' = ?',
                correctAnswer: table * multiplicand
            };
            
            exercise.options = this.generateOptions(exercise.correctAnswer);
            this.exercises.push(exercise);
        }
        
        console.log('📝 Ejercicios generados:', this.exercises.length);
    } catch (error) {
        console.log('Error generando ejercicios:', error);
    }
};

// Generar opciones de respuesta
MultiBoost.prototype.generateOptions = function(correctAnswer) {
    try {
        var options = [correctAnswer];
        
        while (options.length < 4) {
            var wrongAnswer;
            
            if (options.length === 1) {
                wrongAnswer = this.getSumOfDigits(correctAnswer);
            } else {
                var variance = Math.floor(Math.random() * 10) + 1;
                wrongAnswer = Math.random() > 0.5 ? 
                    correctAnswer + variance : 
                    Math.max(1, correctAnswer - variance);
            }
            
            if (options.indexOf(wrongAnswer) === -1 && wrongAnswer > 0) {
                options.push(wrongAnswer);
            }
        }
        
        return this.shuffleArray(options);
    } catch (error) {
        console.log('Error generando opciones:', error);
        return [correctAnswer, correctAnswer + 1, correctAnswer + 2, correctAnswer + 3];
    }
};

// Suma de dígitos
MultiBoost.prototype.getSumOfDigits = function(number) {
    try {
        return number.toString().split('').reduce(function(sum, digit) {
            return sum + parseInt(digit);
        }, 0);
    } catch (error) {
        return number + 1;
    }
};

// Mezclar array
MultiBoost.prototype.shuffleArray = function(array) {
    try {
        var shuffled = array.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    } catch (error) {
        return array;
    }
};

// Mostrar siguiente ejercicio
MultiBoost.prototype.showNextExercise = function() {
    try {
        if (this.currentExercise >= this.exercises.length) {
            this.showResults();
            return;
        }

        var exercise = this.exercises[this.currentExercise];
        
        var questionEl = document.getElementById('exercise-question');
        if (questionEl) {
            questionEl.textContent = exercise.question;
        }

        var progressTextEl = document.getElementById('progress-text');
        if (progressTextEl) {
            progressTextEl.textContent = 'Ejercicio ' + (this.currentExercise + 1) + ' de ' + this.exercises.length;
        }
        
        var progressPercentage = ((this.currentExercise) / this.exercises.length) * 100;
        var progressFillEl = document.getElementById('progress-fill');
        if (progressFillEl) {
            progressFillEl.style.width = progressPercentage + '%';
        }
        
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length && i < exercise.options.length; i++) {
            optionBtns[i].textContent = exercise.options[i];
            optionBtns[i].setAttribute('data-answer', exercise.options[i]);
            optionBtns[i].className = 'option-btn';
            optionBtns[i].disabled = false;
        }

        this.startExerciseTimer();
        console.log('📝 Ejercicio ' + (this.currentExercise + 1) + ':', exercise.question);
    } catch (error) {
        console.log('Error mostrando ejercicio:', error);
    }
};

// Timer de ejercicio
MultiBoost.prototype.startExerciseTimer = function() {
    var self = this;
    
    try {
        this.timeLeft = 10;
        this.updateTimerDisplay();
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(function() {
            self.timeLeft--;
            self.updateTimerDisplay();
            
            if (self.timeLeft <= 0) {
                clearInterval(self.timer);
                self.timeOut();
            }
        }, 1000);
    } catch (error) {
        console.log('Error con timer:', error);
    }
};

// Actualizar display del timer
MultiBoost.prototype.updateTimerDisplay = function() {
    try {
        var timerEl = document.getElementById('timer-display');
        if (!timerEl) return;
        
        timerEl.textContent = this.timeLeft;
        timerEl.className = 'timer';
        
        if (this.timeLeft <= 3) {
            timerEl.className += ' danger';
        } else if (this.timeLeft <= 5) {
            timerEl.className += ' warning';
        }
    } catch (error) {
        console.log('Error actualizando timer:', error);
    }
};

// Timer de sesión
MultiBoost.prototype.startSessionTimer = function() {
    var self = this;
    
    try {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        this.sessionTimer = setInterval(function() {
            var elapsed = Math.floor((new Date().getTime() - self.sessionStartTime) / 1000);
            var minutes = Math.floor(elapsed / 60);
            var seconds = elapsed % 60;
            
            var timeEl = document.getElementById('total-time');
            if (timeEl) {
                var minStr = minutes < 10 ? '0' + minutes : minutes.toString();
                var secStr = seconds < 10 ? '0' + seconds : seconds.toString();
                timeEl.textContent = minStr + ':' + secStr;
            }
        }, 1000);
    } catch (error) {
        console.log('Error con timer de sesión:', error);
    }
};

// Seleccionar respuesta
MultiBoost.prototype.selectAnswer = function(btn) {
    var self = this;
    
    try {
        if (btn.disabled) return;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        var selectedAnswer = parseInt(btn.getAttribute('data-answer'));
        var correctAnswer = this.exercises[this.currentExercise].correctAnswer;
        
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].disabled = true;
        }
        
        btn.classList.add('selected');
        
        if (selectedAnswer === correctAnswer) {
            btn.classList.add('correct');
            this.stats.correct++;
            this.playCorrectSound();
            console.log('✅ Respuesta correcta!');
        } else {
            btn.classList.add('incorrect');
            this.stats.incorrect++;
            
            for (var i = 0; i < optionBtns.length; i++) {
                if (parseInt(optionBtns[i].getAttribute('data-answer')) === correctAnswer) {
                    optionBtns[i].classList.add('correct');
                }
            }
            
            this.stats.mistakes.push({
                question: this.exercises[this.currentExercise].question,
                userAnswer: selectedAnswer,
                correctAnswer: correctAnswer
            });
            
            this.playIncorrectSound();
            console.log('❌ Respuesta incorrecta');
        }
        
        this.updateStatsDisplay();
        
        setTimeout(function() {
            self.currentExercise++;
            self.showNextExercise();
        }, 1500);
    } catch (error) {
        console.log('Error seleccionando respuesta:', error);
    }
};

// Tiempo agotado
MultiBoost.prototype.timeOut = function() {
    var self = this;
    
    try {
        console.log('⏰ Tiempo agotado');
        var correctAnswer = this.exercises[this.currentExercise].correctAnswer;
        
        this.stats.incorrect++;
        
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].disabled = true;
            if (parseInt(optionBtns[i].getAttribute('data-answer')) === correctAnswer) {
                optionBtns[i].classList.add('correct');
            }
        }
        
        this.stats.mistakes.push({
            question: this.exercises[this.currentExercise].question,
            userAnswer: 'Sin respuesta (tiempo agotado)',
            correctAnswer: correctAnswer
        });
        
        this.updateStatsDisplay();
        this.playIncorrectSound();
        
        setTimeout(function() {
            self.currentExercise++;
            self.showNextExercise();
        }, 1500);
    } catch (error) {
        console.log('Error en timeout:', error);
    }
};

// Actualizar estadísticas
MultiBoost.prototype.updateStatsDisplay = function() {
    try {
        var correctEl = document.getElementById('correct-count');
        if (correctEl) {
            correctEl.textContent = this.stats.correct;
        }

        var incorrectEl = document.getElementById('incorrect-count');
        if (incorrectEl) {
            incorrectEl.textContent = this.stats.incorrect;
        }
    } catch (error) {
        console.log('Error actualizando estadísticas:', error);
    }
};

// Mostrar resultados
MultiBoost.prototype.showResults = function() {
    try {
        console.log('🏁 Entrenamiento completado');
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        var totalExercises = this.stats.correct + this.stats.incorrect;
        var percentage = Math.round((this.stats.correct / totalExercises) * 100);
        var finalTime = Math.floor((new Date().getTime() - this.sessionStartTime) / 1000);
        
        var elements = {
            'final-correct': this.stats.correct,
            'final-incorrect': this.stats.incorrect,
            'final-percentage': percentage + '%'
        };
        
        for (var id in elements) {
            var el = document.getElementById(id);
            if (el) {
                el.textContent = elements[id];
            }
        }
        
        var minutes = Math.floor(finalTime / 60);
        var seconds = finalTime % 60;
        var timeEl = document.getElementById('final-time');
        if (timeEl) {
            var minStr = minutes < 10 ? '0' + minutes : minutes.toString();
            var secStr = seconds < 10 ? '0' + seconds : seconds.toString();
            timeEl.textContent = minStr + ':' + secStr;
        }
        
        var resultsTitle = document.getElementById('results-title');
        if (resultsTitle) {
            if (percentage >= 80) {
                resultsTitle.textContent = '🎉 ¡EXCELENTE ENTRENAMIENTO!';
                resultsTitle.style.color = '#10b981';
                this.playCelebrationSound();
            } else if (percentage >= 60) {
                resultsTitle.textContent = '👍 ¡BUEN TRABAJO!';
                resultsTitle.style.color = '#f59e0b';
            } else {
                resultsTitle.textContent = '💪 ¡SIGUE PRACTICANDO!';
                resultsTitle.style.color = '#f97316';
            }
        }
        
        this.showMistakesReview();
        this.configureResultsButtons(percentage);
        this.showScreen('results');
    } catch (error) {
        console.log('Error mostrando resultados:', error);
    }
};

// Mostrar errores
MultiBoost.prototype.showMistakesReview = function() {
    try {
        var mistakesContainer = document.getElementById('mistakes-review');
        if (!mistakesContainer) return;
        
        if (this.stats.mistakes.length === 0) {
            mistakesContainer.style.display = 'none';
            return;
        }
        
        mistakesContainer.style.display = 'block';
        
        var html = '<h3 style="color: #ef4444; margin-bottom: 15px;">📋 Revisión de Errores:</h3>';
        
        for (var i = 0; i < this.stats.mistakes.length; i++) {
            var mistake = this.stats.mistakes[i];
            html += '<div style="background: white; padding: 10px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ef4444;">';
            html += '<strong>' + mistake.question + '</strong><br>';
            html += '<span style="color: #ef4444;">Tu respuesta: ' + mistake.userAnswer + '</span><br>';
            html += '<span style="color: #10b981;">Respuesta correcta: ' + mistake.correctAnswer + '</span>';
            html += '</div>';
        }
        
        mistakesContainer.innerHTML = html;
    } catch (error) {
        console.log('Error mostrando errores:', error);
    }
};

// Configurar botones de resultados
MultiBoost.prototype.configureResultsButtons = function(percentage) {
    try {
        var repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            if (percentage < 80) {
                repeatBtn.style.display = 'inline-block';
                repeatBtn.textContent = '🔄 Repetir Entrenamiento';
            } else {
                repeatBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.log('Error configurando botones:', error);
    }
};

// Repetir entrenamiento
MultiBoost.prototype.repeatTraining = function() {
    try {
        console.log('🔄 Repitiendo entrenamiento...');
        this.cleanupSession();
        this.startTraining();
    } catch (error) {
        console.log('Error repitiendo:', error);
    }
};

// Nuevo entrenamiento
MultiBoost.prototype.newTraining = function() {
    try {
        console.log('🚀 Nuevo entrenamiento');
        this.cleanupSession();
        this.showScreen('config');
    } catch (error) {
        console.log('Error nuevo entrenamiento:', error);
    }
};

// LIMPIEZA COMPLETA DE SESIÓN - ¡LA CLAVE DEL ARREGLO!
MultiBoost.prototype.cleanupSession = function() {
    try {
        console.log('🧹 Limpiando sesión...');
        
        // Limpiar todos los timers
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        // Resetear estado
        this.currentExercise = 0;
        this.exercises = [];
        this.timeLeft = 10;
        this.sessionStartTime = null;
        
        // Limpiar interfaz de ejercicios
        var optionBtns = document.querySelectorAll('.option-btn');
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].className = 'option-btn';
            optionBtns[i].disabled = false;
            optionBtns[i].textContent = '';
        }
        
        // Resetear timer visual
        var timerEl = document.getElementById('timer-display');
        if (timerEl) {
            timerEl.textContent = '10';
            timerEl.className = 'timer';
        }
        
        // Resetear barra de progreso
        var progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        
        // Resetear tiempo total
        var totalTimeEl = document.getElementById('total-time');
        if (totalTimeEl) {
            totalTimeEl.textContent = '00:00';
        }
        
        console.log('✅ Sesión completamente limpia');
    } catch (error) {
        console.log('Error limpiando sesión:', error);
    }
};

// Resetear estadísticas
MultiBoost.prototype.resetStats = function() {
    this.stats = {
        correct: 0,
        incorrect: 0,
        mistakes: []
    };
    this.updateStatsDisplay();
};

// Sonidos simulados
MultiBoost.prototype.playCorrectSound = function() {
    console.log('🔊 ♪ Sonido: Respuesta correcta');
};

MultiBoost.prototype.playIncorrectSound = function() {
    console.log('🔊 ♪ Sonido: Respuesta incorrecta');
};

MultiBoost.prototype.playCelebrationSound = function() {
    console.log('🔊 ♪ Sonido: ¡Celebración!');
};

// Inicializar MultiBoost
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.multiBoost = new MultiBoost();
        });
    } else {
        window.multiBoost = new MultiBoost();
    }
})();
