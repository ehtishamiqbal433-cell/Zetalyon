import asyncio
import json
import websockets

async def send_telemetry():
    uri = "ws://127.0.0.1:8765"
    print(f"[*] Connecting to telemetry engine at {uri}...")
    
    async with websockets.connect(uri) as websocket:
        payload = {
            "operator_id": "OPERATOR_01",
            "session_token": "0x8F2E42",
            "timestamp": 1785827166,
            "metrics": {
                "keystroke_dwell_ms": 65.2,
                "flight_time_ms": 104.8,
                "pointer_curvature_entropy": 3.85
            }
        }
        await websocket.send(json.dumps(payload))
        print("[>] Telemetry payload dispatched successfully.")

        response = await websocket.recv()
        print(f"[<] Engine Attestation Result: {response}")

if __name__ == "__main__":
    asyncio.run(send_telemetry())
