const path = require('path')

module.exports = function (variable, email, order) {

    return {
        from: variable.GC_EMAIL,
        to: email, 
        subject: `New order ${order.orderNumber}`,
        text: `New order ${order.orderNumber}`,
        html: `<header style="padding: 1rem;background-color: #4db6ac !important;">
        
        <span style="color: white; font-size: 18px;line-height: 20px;font-weight: 400;>New order ${order.orderNumber} in</span>
        <small style="padding: 0;color: white;font-size: 14px;line-height: 16px;font-weight: 400;>${new Intl.DateTimeFormat(
          'us-US',
          {
              year: 'numeric', 
              month: 'long', 
              weekday:'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
          }
      ).format(new Date(order.date))}<small></header>
        <body>  
        <center style="text-align: left; vertical-align: middle;">
        <table style="border: 1px solid rgba(160,160,160,0.2); border-radius: 4px; width: 600px">
          <thead style="padding: 1rem">
            <tr>
                <th>Picture</th>
                <th>Name</th>
                <th>Count</th>
                <th>Price</th>
            </tr>
          </thead>
  
          <tbody>
          ${order.courses.map(item => {
              return ` 
              <tr style="width: 100%; padding: 1rem; ">
                <td><img width="100px" src="${path.join(variable.BASE_URL,'img', 'courses', item.course.file.fullname)}" alt="${item.course.title}"/></td>
                <td>${item.course.title}</td>
                <td>${item.counter}</td>
                <td>${item.course.price}</td>
              </tr>`
              })}
              <tr style="width: 100%; padding: 1rem">
              <td collspan="4"><p ><strong>Total price: </strong><span >${order.totalPrice} USD</span></p></td>
              </tr>
          </tbody>
        </table>
        </center>  
        </body>
        <footer style="background-color:#4db6ac; padding: 1rem ">
            &copy;${new Date().getFullYear()}
        </footer>
       `,
      };

}