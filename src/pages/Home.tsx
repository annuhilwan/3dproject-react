import '../styles/Home.css'
import { ThreeScene } from '../components/ThreeScene'
import { InteractiveControls } from '../components/InteractiveControls'

function Home() {
  return (
    <div className="home-container">
      <div className="view-container">
        <div className="scene-wrapper">
          <ThreeScene />
        </div>
        <InteractiveControls />
      </div>
    </div>
  )
}

export default Home
