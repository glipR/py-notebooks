function App() {
  return (
    <div className="App">
      <ul>
        <li><a href={`/notebooks/1`}>Cubes Notebook</a></li>
        <li><a href={`/notebooks/2`}>Turtle Notebook</a></li>
        <li><a href={`/notebooks/3`}>Terminal Notebook</a></li>
      </ul>

      <h2>Intro</h2>
      <ul>
        <li><a href={`/notebooks/intro/1`}>Intro 1 - Data</a></li>
        <li><a href={`/notebooks/intro/2`}>Intro 2 - Numbers Challenge #1</a></li>
        <li><a href={`/notebooks/intro/3`}>Intro 3 - Numbers Challenges #2 and #3</a></li>
      </ul>
      <h2>Strings</h2>
      <ul>
        <li><a href={`/notebooks/strings/1`}>Strings 1 - Print vs. "Print"</a></li>
        <li><a href={`/notebooks/strings/2`}>Strings 2 - Strings Challenge</a></li>
      </ul>
      <h2>Variables</h2>
      <ul>
        <li><a href={`/notebooks/variables/1`}>Variables 1 - Intro</a></li>
        <li><a href={`/notebooks/variables/2`}>Variables 2 - Challenge #1</a></li>
        <li><a href={`/notebooks/variables/3`}>Variables 3 - Challenge #2</a></li>
        <li><a href={`/notebooks/variables/4`}>Variables 4 - Variables defining themselves?</a></li>
        <li><a href={`/notebooks/variables/5`}>Variables 5 - Challenge #3</a></li>
      </ul>
      <h2>Calling Functions</h2>
      <ul>
        <li><a href={`/notebooks/functions/1`}>Functions 1 - Intro</a></li>
        <li><a href={`/notebooks/functions/2`}>Functions 2 - Return Values</a></li>
      </ul>
      <h2>Conditions</h2>
      <ul>
        <li><a href={`/notebooks/conditions/1`}>Conditions 1 - Intro</a></li>
        <li><a href={`/notebooks/conditions/2`}>Conditions 2 - Combining Conditions</a></li>
        <li><a href={`/notebooks/conditions/3`}>Conditions 3 - Extra If Tools</a></li>
        <li><a href={`/notebooks/conditions/4`}>Conditions 4 - Challenge - Keys</a></li>
      </ul>
    </div>
  );
}

export default App;
