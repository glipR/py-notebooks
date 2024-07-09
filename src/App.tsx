import { Link } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <h2>Testing / Showcase Notebooks</h2>
      <ul>
        <li><Link to='/notebooks/1'>Cubes Notebook</Link></li>
        <li><Link to='/notebooks/2'>Turtle Notebook</Link></li>
        <li><Link to='/notebooks/3'>Terminal Notebook</Link></li>
        <li><Link to='/notebooks/sandpiles-demo'>Sandpiles Demo</Link></li>
      </ul>

      <h2>Intro</h2>
      <ul>
        <li><Link to='/notebooks/intro/1'>Intro 1 - Data</Link></li>
        <li><Link to='/notebooks/intro/2'>Intro 2 - Numbers Challenge #1</Link></li>
        <li><Link to='/notebooks/intro/3'>Intro 3 - Numbers Challenges #2 and #3</Link></li>
      </ul>
      <h2>Strings</h2>
      <ul>
        <li><Link to='/notebooks/strings/1'>Strings 1 - Print vs. "Print"</Link></li>
        <li><Link to='/notebooks/strings/2'>Strings 2 - Strings Challenge</Link></li>
      </ul>
      <h2>Variables</h2>
      <ul>
        <li><Link to='/notebooks/variables/1'>Variables 1 - Intro</Link></li>
        <li><Link to='/notebooks/variables/2'>Variables 2 - Challenge #1</Link></li>
        <li><Link to='/notebooks/variables/3'>Variables 3 - Challenge #2</Link></li>
        <li><Link to='/notebooks/variables/4'>Variables 4 - Variables defining themselves?</Link></li>
        <li><Link to='/notebooks/variables/5'>Variables 5 - Challenge #3</Link></li>
      </ul>
      <h2>Calling Functions</h2>
      <ul>
        <li><Link to='/notebooks/functions/1'>Functions 1 - Intro</Link></li>
        <li><Link to='/notebooks/functions/2'>Functions 2 - Return Values</Link></li>
      </ul>
      <h2>Conditions</h2>
      <ul>
        <li><Link to='/notebooks/conditions/1'>Conditions 1 - Intro</Link></li>
        <li><Link to='/notebooks/conditions/2'>Conditions 2 - Combining Conditions</Link></li>
        <li><Link to='/notebooks/conditions/3'>Conditions 3 - Extra If Tools</Link></li>
        <li><Link to='/notebooks/conditions/4'>Conditions 4 - Challenge - Keys</Link></li>
      </ul>
    </div>
  );
}

export default App;
