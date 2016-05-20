class ListBox extends React.Component {
  
  render () {
    const skillList = ['HTML', 'JavaScript', 'jQuery', 'AJAX', 'React', 'CSS'];
    return (
      <div>
        <div>Hello</div>
        <div>
          <ul>
            {skillList.map(topic => <li>{topic}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ListBox />,
  document.getElementById("content")
);
