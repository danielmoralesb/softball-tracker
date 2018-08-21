const Data = (function(elem){
    const parent = document.querySelector(elem);
    const endPoint = parent.id;

    function getData(templateCB) {

        fetch(`http://localhost:4000/${endPoint}`)
       .then(resp => resp.json())
       .then(json => {
           parent.innerHTML = json.map(templateCB).join('')
           checkForData();
           const deleteBtns = document.querySelectorAll('.item__delete');
           deleteBtns.forEach(deleteBtn => deleteBtn.addEventListener('click', deleteData));
       });
    }

    function deleteData(e) {
        const parent = e.target.parentNode.parentNode;
        const parentId = parent.getAttribute('id');

        parent.remove();
        checkForData();

        fetch(`http://localhost:4000/${endPoint}/${parentId}`, {
            method: 'delete'
        })
        .then(resp => resp.json());
    }

    function checkForData() {
        const itemsLists = document.querySelectorAll('.items');
        itemsLists.forEach(itemList => checkForChildren(itemList));

        function checkForChildren(list) {
            if (!list.children.length > 0) {
                const message = document.createElement('h2');
                message.innerText = `Please add ${endPoint} to your team`;
                message.classList.add('screen__msg');

                list.parentNode.prepend(message);
            }
        }
    }

    return {
        getData: getData
    }
});

