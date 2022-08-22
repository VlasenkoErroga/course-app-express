module.exports = function (variable, email, token) {

    return {
        from: variable.GC_EMAIL,
        to: email, 
        subject: `Restore access`,
        text: `Restore access`,
        html: `
        <h1>Forgot password</h1>
        <p>If not, ignored this letter or else you must can use this link for change password <br/> <hr /> <a href="${variable.BASE_URL}/auth/password/${token}">Restore access</a></p>`,
      };

}