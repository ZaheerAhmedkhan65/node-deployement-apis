function notification(message,type){
    const notificationContainer = document.createElement("div");
    notificationContainer.classList.add("notification",type);
    notificationContainer.innerHTML = `
                                    <div class="p-2">
                                        ${message}
                                    </div> 
                                    `;

    document.body.appendChild(notificationContainer);
    setTimeout(()=>{
        notificationContainer.remove();
    },3000)
}