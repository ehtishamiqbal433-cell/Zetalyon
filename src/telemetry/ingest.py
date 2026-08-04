import asyncio
import json
import websockets

async def handle_telemetry(websocket, path=None):
    print("[-] Client connected to Zetalyon Telemetry Ingest Endpoint.")
    try:
        async for message in websocket:
            data = json.loads(message)
            operator = data.get("operator_id", "UNKNOWN")
            metrics = data.get("metrics", {})
            
            dwell = metrics.get("keystroke_dwell_ms", 0)
            flight = metrics.get("flight_time_ms", 0)
            entropy = metrics.get("pointer_curvature_entropy", 0)
            
            print(f"[+] Payload Received from {operator} | Dwell: {dwell}ms | Flight: {flight}ms | Entropy: {entropy}")
            
            score = 0.95 if entropy > 3.0 else 0.72
            response = {
                "status": "PROCESSED",
                "attestation_score": score,
                "action": "ALLOW" if score >= 0.85 else "RE_ATTEST"
            }
            await websocket.send(json.dumps(response))
    except websockets.exceptions.ConnectionClosed:
        print("[-] Client disconnected.")

async def main():
    print("[*] Starting Zetalyon Telemetry Ingest Server on ws://0.0.0.0:8765 ...")
    async with websockets.serve(handle_telemetry, "0.0.0.0", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
