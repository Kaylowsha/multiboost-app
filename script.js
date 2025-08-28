// MULTIBOOST - ENTRENAMIENTO DE MULTIPLICACIONES
// Clase principal que maneja toda la aplicación

class MultiBoost {
    constructor() {
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
    init() {
        this.bindEvents();
        this.showScreen('welcome');
        console.log('🚀 MultiBoost iniciado correctamente');
    }

    // Vincular eventos de los botones
    bindEvents() {
        // Botón de inicio
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('config');
        });

        // Botones de selección de tablas
        document.querySelectorAll('.table-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleTable(btn));
        });

        // Botones rápidos
        document.getElementById('select-all-btn').addEventListener('click', () => this.selectAllTables());
        document.getElementById('clear-all-btn').addEventListener('click', () => this.clearAllTables());
        document.getElementById('surprise-btn').addEventListener('click', () => this.surpriseSelection());

        // Botones de cantidad de ejercicios
        document.querySelectorAll('.exercise-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectExerciseCount(btn));
        });

        // Botón iniciar entrenamiento
        document.getElementById('start-training-btn').addEventListener('click', () => {
            this.startTraining();
        });

        // Botones de opciones en ejercicios
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectAnswer(btn));
        });

        // Botones de resultados
        document.getElementById('repeat-btn').addEventListener('click', () => this.repeatTraining());
        document.getElementById('new-training-btn').addEventListener('click', () => this.newTraining());
    }

    // Mostrar pantalla específica
    showScreen(screenName) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar la pantalla solicitada
        document.getElementById(screenName + '-screen').classList.add('active');
        this.currentScreen = screenName;
        
        console.log(`📺 Mostrando pantalla: ${screenName}`);
    }

    // CONFIGURACIÓN - Seleccionar/deseleccionar tabla
    toggleTable(btn) {
        const table = parseInt(btn.dataset.table);
        
        if (btn.classList.contains('selected')) {
            // Deseleccionar
            btn.classList.remove('selected');
            this.selectedTables = this.selectedTables.filter(t => t !== table);
        } else {
            // Seleccionar
            btn.classList.add('selected');
            this.selectedTables.push(table);
        }

        this.updateStartButton();
        console.log('📊 Tablas seleccionadas:', this.selectedTables);
    }

    // Seleccionar todas las tablas
    selectAllTables() {
        document.querySelectorAll('.table-btn').forEach(btn => {
            btn.classList.add('selected');
        });
        this.selectedTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.updateStartButton();
        console.log('✅ Todas las tablas seleccionadas');
    }

    // Limpiar selección de tablas
    clearAllTables() {
        document.querySelectorAll('.table-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.selectedTables = [];
        this.updateStartButton();
        console.log('❌ Tablas deseleccionadas');
    }

    // Selección sorpresa (1-3 tablas aleatorias)
    surpriseSelection() {
        this.clearAllTables();
        
        const allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        const surpriseCount = Math.floor(Math.random() * 3) + 1; // 1-3 tablas
        
        for (let i = 0; i < surpriseCount; i++) {
            const randomIndex = Math.floor(Math.random() * allTables.length);
            const randomTable = allTables.splice(randomIndex, 1)[0];
            
            this.selectedTables.push(randomTable);
            document.querySelector(`[data-table="${randomTable}"]`).classList.add('selected');
        }
        
        this.updateStartButton();
        console.log('🎲 Selección sorpresa:', this.selectedTables);
    }

    // Seleccionar cantidad de ejercicios
    selectExerciseCount(btn) {
        // Remover clase active de todos los botones
        document.querySelectorAll('.exercise-btn').forEach(b => b.classList.remove('active'));
        
        // Activar botón seleccionado
        btn.classList.add('active');
        this.exerciseCount = parseInt(btn.dataset.count);
        
        console.log('🎯 Ejercicios seleccionados:', this.exerciseCount);
    }

    // Actualizar estado del botón de inicio
    updateStartButton() {
        const startBtn = document.getElementById('start-training-btn');
        
        if (this.selectedTables.length > 0) {
            startBtn.disabled = false;
            startBtn.textContent = '💪 ¡INICIAR ENTRENAMIENTO!';
        } else {
            startBtn.disabled = true;
            startBtn.textContent = '⚠️ Selecciona al menos una tabla';
        }
    }

    // ENTRENAMIENTO - Iniciar sesión de ejercicios
    startTraining() {
        console.log('🚀 Iniciando entrenamiento...');
        console.log('📊 Tablas:', this.selectedTables);
        console.log('🎯 Ejercicios:', this.exerciseCount);

        // Resetear estadísticas
        this.resetStats();
        
        // Generar ejercicios
        this.generateExercises();
        
        // Iniciar timer global
        this.sessionStartTime = Date.now();
        this.startSessionTimer();
        
        // Mostrar primer ejercicio
        this.currentExercise = 0;
        this.showNextExercise();
        
        // Cambiar a pantalla de ejercicios
        this.showScreen('exercise');
    }

    // Generar todos los ejercicios de la sesión
    generateExercises() {
        this.exercises = [];
        
        for (let i = 0; i < this.exerciseCount; i++) {
            // Elegir tabla aleatoria de las seleccionadas
            const table = this.selectedTables[Math.floor(Math.random() * this.selectedTables.length)];
            
            // Generar multiplicando aleatorio (1-10)
            const multiplicand = Math.floor(Math.random() * 10) + 1;
            
            // Crear ejercicio
            const exercise = {
                table: table,
                multiplicand: multiplicand,
                question: `${table} × ${multiplicand} = ?`,
                correctAnswer: table * multiplicand
            };
            
            // Generar opciones de respuesta
            exercise.options = this.generateOptions(exercise.correctAnswer);
            
            this.exercises.push(exercise);
        }
        
        console.log('📝 Ejercicios generados:', this.exercises.length);
    }

    // Generar 4 opciones de respuesta
    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        
        // Generar 3 opciones incorrectas
        while (options.length < 4) {
            let wrongAnswer;
            
            if (options.length === 1) {
                // Primera opción incorrecta: suma de dígitos
                wrongAnswer = this.getSumOfDigits(correctAnswer);
            } else {
                // Otras opciones: números cercanos aleatorios
                const variance = Math.floor(Math.random() * 10) + 1;
                wrongAnswer = Math.random() > 0.5 ? 
                    correctAnswer + variance : 
                    Math.max(1, correctAnswer - variance);
            }
            
            // Evitar duplicados
            if (!options.includes(wrongAnswer) && wrongAnswer > 0) {
                options.push(wrongAnswer);
            }
        }
        
        // Mezclar opciones aleatoriamente
        return this.shuffleArray(options);
    }

    // Suma de dígitos de un número
    getSumOfDigits(number) {
        return number.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    // Mezclar array aleatoriamente
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Mostrar siguiente ejercicio
    showNextExercise() {
        if (this.currentExercise >= this.exercises.length) {
            this.showResults();
            return;
        }

        const exercise = this.exercises[this.currentExercise];
        
        // Actualizar interfaz
        document.getElementById('exercise-question').textContent = exercise.question;
        document.getElementById('progress-text').textContent = 
            `Ejercicio ${this.currentExercise + 1} de ${this.exercises.length}`;
        
        // Actualizar barra de progreso
        const progressPercentage = ((this.currentExercise) / this.exercises.length) * 100;
        document.getElementById('progress-fill').style.width = progressPercentage + '%';
        
        // Configurar opciones
        const optionBtns = document.querySelectorAll('.option-btn');
        exercise.options.forEach((option, index) => {
            optionBtns[index].textContent = option;
            optionBtns[index].dataset.answer = option;
            optionBtns[index].classList.remove('selected', 'correct', 'incorrect');
            optionBtns[index].disabled = false;
        });

        // Iniciar timer del ejercicio
        this.startExerciseTimer();
        
        console.log(`📝 Ejercicio ${this.currentExercise + 1}:`, exercise.question);
    }

    // Timer de ejercicio individual
    startExerciseTimer() {
        this.timeLeft = 10;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeOut();
            }
        }, 1000);
    }

    // Actualizar display del timer
    updateTimerDisplay() {
        const timerEl = document.getElementById('timer-display');
        timerEl.textContent = this.timeLeft;
        
        // Cambiar colores según tiempo restante
        timerEl.classList.remove('warning', 'danger');
        
        if (this.timeLeft <= 3) {
            timerEl.classList.add('danger');
        } else if (this.timeLeft <= 5) {
            timerEl.classList.add('warning');
        }
    }

    // Timer global de la sesión
    startSessionTimer() {
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            document.getElementById('total-time').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Seleccionar respuesta
    selectAnswer(btn) {
        if (btn.disabled) return;
        
        clearInterval(this.timer);
        const selectedAnswer = parseInt(btn.dataset.answer);
        const correctAnswer = this.exercises[this.currentExercise].correctAnswer;
        
        // Deshabilitar todos los botones
        document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        
        // Marcar respuesta seleccionada
        btn.classList.add('selected');
        
        if (selectedAnswer === correctAnswer) {
            // Respuesta correcta
            btn.classList.add('correct');
            this.stats.correct++;
            this.playCorrectSound();
            console.log('✅ Respuesta correcta!');
        } else {
            // Respuesta incorrecta
            btn.classList.add('incorrect');
            this.stats.incorrect++;
            
            // Mostrar respuesta correcta
            document.querySelectorAll('.option-btn').forEach(b => {
                if (parseInt(b.dataset.answer) === correctAnswer) {
                    b.classList.add('correct');
                }
            });
            
            // Guardar error para revisión
            this.stats.mistakes.push({
                question: this.exercises[this.currentExercise].question,
                userAnswer: selectedAnswer,
                correctAnswer: correctAnswer
            });
            
            this.playIncorrectSound();
            console.log('❌ Respuesta incorrecta');
        }
        
        // Actualizar contadores
        this.updateStatsDisplay();
        
        // Siguiente ejercicio después de 1.5 segundos
        setTimeout(() => {
            this.currentExercise++;
            this.showNextExercise();
        }, 1500);
    }

    // Tiempo agotado
    timeOut() {
        console.log('⏰ Tiempo agotado');
        const correctAnswer = this.exercises[this.currentExercise].correctAnswer;
        
        // Marcar como incorrecto
        this.stats.incorrect++;
        
        // Mostrar respuesta correcta
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.answer) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        // Guardar error
        this.stats.mistakes.push({
            question: this.exercises[this.currentExercise].question,
            userAnswer: 'Sin respuesta (tiempo agotado)',
            correctAnswer: correctAnswer
        });
        
        this.updateStatsDisplay();
        this.playIncorrectSound();
        
        // Siguiente ejercicio
        setTimeout(() => {
            this.currentExercise++;
            this.showNextExercise();
        }, 1500);
    }

    // Actualizar estadísticas en pantalla
    updateStatsDisplay() {
        document.getElementById('correct-count').textContent = this.stats.correct;
        document.getElementById('incorrect-count').textContent = this.stats.incorrect;
    }

    // Mostrar resultados finales
    showResults() {
        console.log('🏁 Entrenamiento completado');
        
        // Calcular estadísticas finales
        const totalExercises = this.stats.correct + this.stats.incorrect;
        const percentage = Math.round((this.stats.correct / totalExercises) * 100);
        const finalTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        const avgTime = Math.round(finalTime / totalExercises);
        
        // Actualizar pantalla de resultados
        document.getElementById('final-correct').textContent = this.stats.correct;
        document.getElementById('final-incorrect').textContent = this.stats.incorrect;
        document.getElementById('final-percentage').textContent = percentage + '%';
        
        const minutes = Math.floor(finalTime / 60);
        const seconds = finalTime % 60;
        document.getElementById('final-time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Título según rendimiento
        const resultsTitle = document.getElementById('results-title');
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
        
        // Mostrar errores si los hay
        this.showMistakesReview();
        
        // Configurar botones según rendimiento
        this.configureResultsButtons(percentage);
        
        this.showScreen('results');
    }

    // Mostrar revisión de errores
    showMistakesReview() {
        const mistakesContainer = document.getElementById('mistakes-review');
        
        if (this.stats.mistakes.length === 0) {
            mistakesContainer.style.display = 'none';
            return;
        }
        
        mistakesContainer.style.display = 'block';
        mistakesContainer.innerHTML = `
            <h3 style="color: #ef4444; margin-bottom: 15px;">📋 Revisión de Errores:</h3>
            ${this.stats.mistakes.map(mistake => `
                <div style="background: white; padding: 10px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <strong>${mistake.question}</strong><br>
                    <span style="color: #ef4444;">Tu respuesta: ${mistake.userAnswer}</span><br>
                    <span style="color: #10b981;">Respuesta correcta: ${mistake.correctAnswer}</span>
                </div>
            `).join('')}
        `;
    }

    // Configurar botones de resultados
    configureResultsButtons(percentage) {
        const repeatBtn = document.getElementById('repeat-btn');
        
        if (percentage < 80) {
            repeatBtn.style.display = 'inline-block';
            repeatBtn.textContent = '🔄 Repetir Entrenamiento';
        } else {
            repeatBtn.style.display = 'none';
        }
    }

    // Repetir entrenamiento con misma configuración
    repeatTraining() {
        console.log('🔄 Repitiendo entrenamiento...');
        this.startTraining();
    }

    // Nuevo entrenamiento (volver a configuración)
    newTraining() {
        console.log('🚀 Nuevo entrenamiento');
        this.showScreen('config');
    }

    // Resetear estadísticas
    resetStats() {
        this.stats = {
            correct: 0,
            incorrect: 0,
            mistakes: []
        };
        
        this.updateStatsDisplay();
    }

    // SONIDOS (simulados con console.log por ahora)
    playCorrectSound() {
        console.log('🔊 ♪ Sonido: Respuesta correcta');
        // Aquí se puede agregar audio real más adelante
    }

    playIncorrectSound() {
        console.log('🔊 ♪ Sonido: Respuesta incorrecta');
        // Aquí se puede agregar audio real más adelante
    }

    playCelebrationSound() {
        console.log('🔊 ♪ Sonido: ¡Celebración!');
        // Aquí se puede agregar audio real más adelante
    }
}

// Inicializar MultiBoost cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    window.multiBoost = new MultiBoost();
});