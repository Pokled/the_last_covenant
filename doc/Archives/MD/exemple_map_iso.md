import {
  Isometric,
  IsometricContainer,
  IsometricPlane,
  IsometricCube,
  IsometricGrid
} from "isometric-react";
import { PanZoom } from "react-easy-panzoom";

import "./styles.css";

export default function App() {
  return (
    <PanZoom>
      <IsometricContainer>
        <Isometric>
          <IsometricGrid
            size={5}
            sizeMultiplier={{
              width: 50,
              height: 50
            }}
            lineweight={1}
            color="red"
          >
            <IsometricPlane
              color="#ffffff"
              position={{ top: 0, left: 0 }}
              width={5}
              height={5}
            />
            <IsometricPlane
              color="#ffffff"
              position={{ top: 15, left: 15 }}
              width={10}
              height={10}
            />
            <div onClick={() => alert("Clicked the cube!")}>
              <IsometricCube
                position={{ top: 15, left: 15 }}
                color="#ffffff"
                depth={2}
                width={10}
                height={10}
              >
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
              </IsometricCube>
            </div>

            <div className="cube" onClick={() => alert("Clicked the cube!")}>
              <IsometricCube
                position={{ top: 35, left: 25 }}
                color="#ffffff"
                depth={2}
                width={10}
                height={10}
              >
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
              </IsometricCube>
            </div>

            <div className="cube" onClick={() => alert("Clicked the cube!")}>
              <IsometricCube
                position={{ top: 15, left: 35 }}
                color="#ffffff"
                depth={2}
                width={15}
                height={15}
              >
                <img
                  alt=""
                  src="https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg"
                  style={{ width: "100%" }}
                />
              </IsometricCube>
            </div>

            <div className="cube" onClick={() => alert("Clicked the cube!")}>
              <IsometricCube
                position={{ top: 70, left: 40 }}
                color="#ffffff"
                depth={2}
                width={15}
                height={15}
              >
                <img
                  alt=""
                  className="disabled"
                  src="https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  className="disabled"
                  src="https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  className="disabled"
                  src="https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg"
                  style={{ width: "100%" }}
                />
              </IsometricCube>
            </div>

            <div className="cube" onClick={() => alert("Clicked the cube!")}>
              <IsometricCube
                position={{ top: 5, left: 40 }}
                color="#ffffff"
                depth={2}
                width={5}
                height={5}
              >
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
              </IsometricCube>
            </div>
            <div className="cube" onClick={() => alert("Clicked the cube!")}>
              <IsometricCube
                position={{ top: 10, left: 0 }}
                color="#ffffff"
                depth={2}
                width={10}
                height={10}
              >
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
                <img
                  alt=""
                  src="https://i.pinimg.com/736x/bb/1c/bd/bb1cbd0dc35d2e510baf1802f96ae00f.jpg"
                  style={{ width: "100%" }}
                />
              </IsometricCube>
            </div>
          </IsometricGrid>
        </Isometric>
      </IsometricContainer>
    </PanZoom>
  );
}