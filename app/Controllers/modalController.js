document.addEventListener('DOMContentLoaded', function() {
    // Función para encontrar formularios de manera más flexible
    function findFormInModal(modalId, formType) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`No se encontró el modal ${modalId}`);
            return null;
        }

        // Buscar formularios dentro del modal
        const forms = modal.getElementsByTagName('form');
        console.log(`Formularios en modal ${modalId}:`, forms);

        // Si hay solo un formulario, devolverlo
        if (forms.length === 1) return forms[0];

        // Si hay múltiples formularios, buscar por tipo de datos
        for (let form of forms) {
            const inputs = form.querySelectorAll('input');
            const inputTypes = Array.from(inputs).map(input => input.id || input.name);
            
            console.log(`Inputs en formulario:`, inputTypes);

            // Lógica para identificar el formulario correcto
            if (formType === 'register' && 
                inputTypes.includes('name') && 
                inputTypes.includes('lastName') && 
                inputTypes.includes('edad')) {
                return form;
            }

            if (formType === 'login' && 
                inputTypes.includes('user') && 
                inputTypes.includes('pswrd')) {
                return form;
            }
        }

        console.error(`No se encontró formulario de ${formType} en modal ${modalId}`);
        return null;
    }

    // Encontrar formularios de manera más robusta
    const registerForm = findFormInModal('Registrarse', 'register');
    const loginForm = findFormInModal('ingresar', 'login');

    console.log('Formulario de registro encontrado:', registerForm);
    console.log('Formulario de login encontrado:', loginForm);

    // Evento de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            console.log('Formulario de registro enviado');
            e.preventDefault(); 
            
            // Buscar inputs de manera más flexible
            const nombre = registerForm.querySelector('#name, [name="name"]');
            const apellido = registerForm.querySelector('#lastName, [name="lastName"]');
            const edad = registerForm.querySelector('#edad, [name="edad"]');
            const numeroMesero = registerForm.querySelector('#numMesero, [name="numMesero"]');
            const password = registerForm.querySelector('#password, [name="password"]');
            const confirmPassword = registerForm.querySelector('#confirmPassword, [name="confirmPassword"]');
            const perfil = registerForm.querySelector('#descripcion, [name="descripcion"]');

            // Verificar que todos los campos existan
            const inputs = [nombre, apellido, edad, numeroMesero, password, confirmPassword, perfil];
            if (inputs.some(input => !input)) {
                console.error('Algunos campos no se encontraron', inputs);
                alert('Por favor, verifica que todos los campos estén presentes');
                return;
            }

            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: `${nombre.value} ${apellido.value}`,
                        edad: parseInt(edad.value),
                        numeroMesero: parseInt(numeroMesero.value),
                        password: password.value,
                        perfil: perfil.value,
                        puesto: 'Mesero'
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Cerrar modal
                    const registroModal = document.getElementById('Registrarse');
                    const modalBackdrop = document.querySelector('.modal-backdrop');
                    
                    // Método 1: Bootstrap Modal
                    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                        const modalInstance = bootstrap.Modal.getInstance(registroModal);
                        if (modalInstance) modalInstance.hide();
                    }

                    // Método 2: jQuery (si está disponible)
                    if (window.jQuery) {
                        $('#Registrarse').modal('hide');
                    }

                    // Método 3: Forzar cierre
                    if (registroModal) {
                        registroModal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                    }

                    // Remover backdrop si existe
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }

                    alert('Registro exitoso');
                    registerForm.reset();
                    window.location.href = '/inicio'
                } else {
                    alert(data.message || 'Error en el registro');
                }
            } catch (error) {
                console.error('Error completo de registro:', error);
                alert('Hubo un problema con el registro: ' + error.message);
            }
        });
    }

    // Evento de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            console.log('Formulario de login enviado');
            e.preventDefault();
            
            // Buscar inputs de manera flexible
            const numeroMesero = loginForm.querySelector('#user, [name="user"]');
            const password = loginForm.querySelector('#pswrd, [name="pswrd"]');

            // Verificar que los campos existan
            if (!numeroMesero || !password) {
                console.error('Campos de login no encontrados');
                alert('Por favor, verifica los campos de inicio de sesión');
                return;
            }

            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        numeroMesero: parseInt(numeroMesero.value),
                        password: password.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Cerrar modal
                    const loginModal = document.getElementById('ingresar');
                    const modalBackdrop = document.querySelector('.modal-backdrop');
                    
                    // Método 1: Bootstrap Modal
                    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                        const modalInstance = bootstrap.Modal.getInstance(loginModal);
                        if (modalInstance) modalInstance.hide();
                    }

                    // Método 2: jQuery (si está disponible)
                    if (window.jQuery) {
                        $('#ingresar').modal('hide');
                    }

                    // Método 3: Forzar cierre
                    if (loginModal) {
                        loginModal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                    }

                    // Remover backdrop si existe
                    if (modalBackdrop) {
                        modalBackdrop.remove();
                    }

                    alert('Inicio de sesión exitoso');
                    window.location.href = '/meseros';
                } else {
                    alert(data.message || 'Error en el inicio de sesión');
                }
            } catch (error) {
                console.error('Error completo de login:', error);
                alert('Hubo un problema con el inicio de sesión: ' + error.message);
            }
        });
    }
});