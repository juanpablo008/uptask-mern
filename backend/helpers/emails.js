import nodemailer from 'nodemailer'

export const emailRegister = async (data) => {
  
  const { email, name, token } = data
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Information of the email

  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu cuenta",
    html: `
    <body>
      <nav class="navigation">
        <h1>UpTask - Gestiona tus tareas</h1>
      </nav>
      <main class="container">
        <h2>Bienvenido a UpTask</h1>
        <p>Hola ${name},</p>
        <p>Para confirmar tu cuenta haz click en el siguiente enlace:</p>
        <button class="btn"><a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirmar cuenta</a></button>
        <p>Si no has solicitado una cuenta en UpTask, ignora este mensaje.</p>
      </main>
      
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
        }
        nav.navigation {
          background-color: #0284c7;
          height: 100px;
          width: 100%;
          display: flex;
          align-items: center;
        }

        nav.navigation h1 {
          color: #fff;
          font-size: 2em;
          font-weight: bold;
          margin-left: 20px;
        }

        main.container {
          text-align: center;
          margin-top: 50px;
        }

        button.btn {
          background-color: #0284c7;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 5px;
          font-size: 1.2em;
          margin-top: 20px;
        }

        button.btn a {
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
        }

        button.btn:hover {
          transition-property: background-color, #0284c7;
          opacity: 0.8;
          transition-duration: 0.5s;
          cursor: pointer;
        }
      </style>
    </body>`
  })

}



export const emailForgotPassword = async (data) => {
  
  const { email, name, token } = data
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Information of the email

  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Reestablece tu contraseña",
    html: `
    <body>
      <nav class="navigation">
        <h1>UpTask - Gestiona tus tareas</h1>
      </nav>
      <main class="container">
        <h2>Bienvenido a UpTask</h1>
        <p>Hola ${name},</p>
        <p>Has solicitado reestablecer tu contraseña</p>
        <p>Para reestablecer tu contraseña haz click en el siguiente enlace:</p>
        <button class="btn"><a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reestablecer contraseña</a></button>
        <p>Si no has solicitado este correo, ignora este mensaje.</p>
      </main>
      
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
        }
        nav.navigation {
          background-color: #0284c7;
          height: 100px;
          width: 100%;
          display: flex;
          align-items: center;
        }

        nav.navigation h1 {
          color: #fff;
          font-size: 2em;
          font-weight: bold;
          margin-left: 20px;
        }

        main.container {
          text-align: center;
          margin-top: 50px;
        }

        button.btn {
          background-color: #0284c7;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 5px;
          font-size: 1.2em;
          margin-top: 20px;
        }

        button.btn a {
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
        }

        button.btn:hover {
          transition-property: background-color, #0284c7;
          opacity: 0.8;
          transition-duration: 0.5s;
          cursor: pointer;
        }
      </style>
    </body>`
  })

}