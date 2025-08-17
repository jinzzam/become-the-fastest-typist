// 드래그 시작
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.innerText);
}

// 드래그 중
function dragOver(event) {
  event.preventDefault();
}

// 드롭
function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  event.target.appendChild(document.createTextNode(data));
}

// 드래그 가능한 요소
// const draggableElement = document.getElementById('text-display');
// draggableElement.addEventListener('dragstart', dragStart);

// 드롭 대상
const dropTarget = document.getElementById('text-display');
dropTarget.addEventListener('dragover', dragOver);
dropTarget.addEventListener('drop', drop);