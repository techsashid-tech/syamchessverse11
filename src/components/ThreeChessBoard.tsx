import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { BoardTheme, PieceStyle } from '../types/chess';

interface ThreeChessBoardProps {
  game: Chess;
  theme: BoardTheme;
  pieceStyle: PieceStyle;
  playerColor: 'w' | 'b';
  selectedSquare: Square | null;
  legalMoves: string[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  onSquareClick: (square: Square) => void;
  disabled?: boolean;
}

// Theme color palettes
const THEME_PALETTES: Record<BoardTheme, {
  lightSquare: number;
  darkSquare: number;
  rim: number;
  lightPiece: number;
  darkPiece: number;
  specular: number;
  background: number;
  ambient: number;
  lightPieceRoughness: number;
  darkPieceRoughness: number;
}> = {
  crimson: {
    lightSquare: 0xf87171,
    darkSquare: 0x2b070a,
    rim: 0x450a0a,
    lightPiece: 0xffffff,
    darkPiece: 0xef4444,
    specular: 0xff3333,
    background: 0x090203,
    ambient: 0x882222,
    lightPieceRoughness: 0.2,
    darkPieceRoughness: 0.2
  },
  classic: {
    lightSquare: 0xf0d9b5,
    darkSquare: 0xb58863,
    rim: 0x4a2c11,
    lightPiece: 0xfbf7eb,
    darkPiece: 0x2b1d14,
    specular: 0x333333,
    background: 0x090d16,
    ambient: 0x888888,
    lightPieceRoughness: 0.35,
    darkPieceRoughness: 0.4
  },
  neon: {
    lightSquare: 0x0ef0e4,
    darkSquare: 0x111c38,
    rim: 0x090e1f,
    lightPiece: 0x00ffff,
    darkPiece: 0xff0077,
    specular: 0x00ffff,
    background: 0x04060c,
    ambient: 0x5577aa,
    lightPieceRoughness: 0.15,
    darkPieceRoughness: 0.15
  },
  space: {
    lightSquare: 0x93a5cf,
    darkSquare: 0x192231,
    rim: 0x0b101b,
    lightPiece: 0xecf0f8,
    darkPiece: 0x3d4b68,
    specular: 0x7788aa,
    background: 0x05070e,
    ambient: 0x667799,
    lightPieceRoughness: 0.2,
    darkPieceRoughness: 0.25
  },
  volcanic: {
    lightSquare: 0xff6600,
    darkSquare: 0x1e1512,
    rim: 0x120a07,
    lightPiece: 0xffcc00,
    darkPiece: 0x261b17,
    specular: 0xff4400,
    background: 0x0c0604,
    ambient: 0x774433,
    lightPieceRoughness: 0.3,
    darkPieceRoughness: 0.4
  },
  candy: {
    lightSquare: 0xffd1dc,
    darkSquare: 0x9be2e8,
    rim: 0x73b2bd,
    lightPiece: 0xffffff,
    darkPiece: 0xed6a9e,
    specular: 0xffffff,
    background: 0x120b18,
    ambient: 0x887799,
    lightPieceRoughness: 0.2,
    darkPieceRoughness: 0.2
  },
  ice: {
    lightSquare: 0xe0f7fa,
    darkSquare: 0x4dd0e1,
    rim: 0x006064,
    lightPiece: 0xffffff,
    darkPiece: 0x00838f,
    specular: 0x80deea,
    background: 0x061118,
    ambient: 0x668899,
    lightPieceRoughness: 0.1,
    darkPieceRoughness: 0.15
  },
  royal: {
    lightSquare: 0xfaf9f6,
    darkSquare: 0x1a1a1a,
    rim: 0xd4af37,
    lightPiece: 0xf5eedc,
    darkPiece: 0x111111,
    specular: 0xffd700,
    background: 0x0a0a0f,
    ambient: 0x998866,
    lightPieceRoughness: 0.18,
    darkPieceRoughness: 0.2
  },
  forest: {
    lightSquare: 0xcedbb2,
    darkSquare: 0x44633f,
    rim: 0x243321,
    lightPiece: 0xf4eedb,
    darkPiece: 0x1f2e1a,
    specular: 0x557744,
    background: 0x070c06,
    ambient: 0x667755,
    lightPieceRoughness: 0.3,
    darkPieceRoughness: 0.35
  }
};

export const ThreeChessBoard: React.FC<ThreeChessBoardProps> = ({
  game,
  theme,
  playerColor,
  selectedSquare,
  legalMoves,
  isCheck,
  onSquareClick,
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const piecesGroupRef = useRef<THREE.Group | null>(null);
  const indicatorsGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());

  // Camera Orbit control state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0, phi: Math.PI / 4, radius: 14 });
  const [, setCameraZoom] = useState(14);

  const squareToWorld = useCallback((sq: Square): { x: number; z: number } => {
    const file = sq.charCodeAt(0) - 97;
    const rank = parseInt(sq[1], 10) - 1;
    const isW = playerColor === 'w';
    const x = isW ? (file - 3.5) : (3.5 - file);
    const z = isW ? (3.5 - rank) : (rank - 3.5);
    return { x, z };
  }, [playerColor]);

  const worldToSquare = useCallback((x: number, z: number): Square | null => {
    const isW = playerColor === 'w';
    const file = isW ? Math.round(x + 3.5) : Math.round(3.5 - x);
    const rank = isW ? Math.round(3.5 - z) : Math.round(z + 3.5);
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
    return `${String.fromCharCode(97 + file)}${rank + 1}` as Square;
  }, [playerColor]);

  const createPieceMesh = useCallback((type: PieceSymbol, color: 'w' | 'b', themePalette: typeof THEME_PALETTES['classic']): THREE.Group => {
    const group = new THREE.Group();
    const isWhite = color === 'w';
    const pieceColor = isWhite ? themePalette.lightPiece : themePalette.darkPiece;
    const mat = new THREE.MeshStandardMaterial({
      color: pieceColor,
      roughness: isWhite ? themePalette.lightPieceRoughness : themePalette.darkPieceRoughness,
      metalness: theme === 'neon' || theme === 'royal' || theme === 'crimson' ? 0.6 : 0.15,
      emissive: theme === 'neon' ? (isWhite ? 0x003344 : 0x440022) : theme === 'crimson' ? (isWhite ? 0x220505 : 0x440505) : 0x000000,
    });

    // Base pedestal
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.12, 24);
    const baseMesh = new THREE.Mesh(baseGeo, mat);
    baseMesh.position.y = 0.06;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    const midGeo = new THREE.CylinderGeometry(0.28, 0.35, 0.1, 20);
    const midMesh = new THREE.Mesh(midGeo, mat);
    midMesh.position.y = 0.17;
    midMesh.castShadow = true;
    group.add(midMesh);

    switch (type) {
      case 'p': {
        const stemGeo = new THREE.CylinderGeometry(0.18, 0.26, 0.45, 16);
        const stem = new THREE.Mesh(stemGeo, mat);
        stem.position.y = 0.42;
        stem.castShadow = true;
        group.add(stem);
        const collarGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.06, 16);
        const collar = new THREE.Mesh(collarGeo, mat);
        collar.position.y = 0.66;
        group.add(collar);
        const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.y = 0.88;
        head.castShadow = true;
        group.add(head);
        break;
      }
      case 'r': {
        const stemGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.65, 16);
        const stem = new THREE.Mesh(stemGeo, mat);
        stem.position.y = 0.52;
        stem.castShadow = true;
        group.add(stem);
        const battlementGeo = new THREE.CylinderGeometry(0.34, 0.28, 0.28, 16);
        const battlement = new THREE.Mesh(battlementGeo, mat);
        battlement.position.y = 0.98;
        battlement.castShadow = true;
        group.add(battlement);
        break;
      }
      case 'n': {
        const stemGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.45, 16);
        const stem = new THREE.Mesh(stemGeo, mat);
        stem.position.y = 0.42;
        stem.castShadow = true;
        group.add(stem);
        const headGeo = new THREE.ConeGeometry(0.32, 0.65, 6);
        const head = new THREE.Mesh(headGeo, mat);
        head.position.set(0, 0.85, 0.08);
        head.rotation.x = 0.4;
        head.castShadow = true;
        group.add(head);
        const snoutGeo = new THREE.BoxGeometry(0.2, 0.22, 0.3);
        const snout = new THREE.Mesh(snoutGeo, mat);
        snout.position.set(0, 0.8, 0.22);
        snout.rotation.x = 0.3;
        group.add(snout);
        break;
      }
      case 'b': {
        const stemGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.65, 16);
        const stem = new THREE.Mesh(stemGeo, mat);
        stem.position.y = 0.52;
        stem.castShadow = true;
        group.add(stem);
        const miterGeo = new THREE.SphereGeometry(0.26, 16, 16);
        miterGeo.scale(1, 1.4, 1);
        const miter = new THREE.Mesh(miterGeo, mat);
        miter.position.y = 1.05;
        miter.castShadow = true;
        group.add(miter);
        const tipGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const tip = new THREE.Mesh(tipGeo, mat);
        tip.position.y = 1.45;
        group.add(tip);
        break;
      }
      case 'q': {
        const stemGeo = new THREE.CylinderGeometry(0.22, 0.32, 0.85, 18);
        const stem = new THREE.Mesh(stemGeo, mat);
        stem.position.y = 0.62;
        stem.castShadow = true;
        group.add(stem);
        const coronetGeo = new THREE.CylinderGeometry(0.36, 0.22, 0.3, 16);
        const coronet = new THREE.Mesh(coronetGeo, mat);
        coronet.position.y = 1.18;
        coronet.castShadow = true;
        group.add(coronet);
        const orbGeo = new THREE.SphereGeometry(0.12, 14, 14);
        const orb = new THREE.Mesh(orbGeo, mat);
        orb.position.y = 1.4;
        group.add(orb);
        break;
      }
      case 'k': {
        const stemGeo = new THREE.CylinderGeometry(0.24, 0.34, 0.95, 18);
        const stem = new THREE.Mesh(stemGeo, mat);
        stem.position.y = 0.68;
        stem.castShadow = true;
        group.add(stem);
        const capGeo = new THREE.CylinderGeometry(0.36, 0.24, 0.32, 16);
        const cap = new THREE.Mesh(capGeo, mat);
        cap.position.y = 1.28;
        cap.castShadow = true;
        group.add(cap);
        const crossV = new THREE.BoxGeometry(0.08, 0.28, 0.08);
        const crossMeshV = new THREE.Mesh(crossV, mat);
        crossMeshV.position.y = 1.56;
        group.add(crossMeshV);
        const crossH = new THREE.BoxGeometry(0.22, 0.08, 0.08);
        const crossMeshH = new THREE.Mesh(crossH, mat);
        crossMeshH.position.y = 1.6;
        group.add(crossMeshH);
        break;
      }
    }
    return group;
  }, [theme]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0.2, 0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const themePalette = THEME_PALETTES[theme] || THEME_PALETTES.crimson;
    scene.background = new THREE.Color(themePalette.background);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(themePalette.ambient, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 12, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(themePalette.specular, 1.2, 22);
    rimLight.position.set(-6, 8, -6);
    scene.add(rimLight);

    // Rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: themePalette.rim,
      roughness: 0.3,
      metalness: theme === 'crimson' ? 0.5 : 0.2
    });
    const rimGeo = new THREE.BoxGeometry(8.9, 0.4, 8.9);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = -0.21;
    rimMesh.receiveShadow = true;
    scene.add(rimMesh);

    // Squares
    const boardGroup = new THREE.Group();
    const lightMat = new THREE.MeshStandardMaterial({
      color: themePalette.lightSquare,
      roughness: 0.25,
      metalness: theme === 'crimson' ? 0.35 : 0.1
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: themePalette.darkSquare,
      roughness: 0.3,
      metalness: theme === 'crimson' ? 0.45 : 0.1
    });
    const sqGeo = new THREE.BoxGeometry(0.98, 0.12, 0.98);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const mesh = new THREE.Mesh(sqGeo, isLight ? lightMat : darkMat);
        const x = c - 3.5;
        const z = 3.5 - r;
        mesh.position.set(x, -0.06, z);
        mesh.receiveShadow = true;
        mesh.name = `sq_${c}_${r}`;
        boardGroup.add(mesh);
      }
    }
    scene.add(boardGroup);

    const piecesGroup = new THREE.Group();
    piecesGroupRef.current = piecesGroup;
    scene.add(piecesGroup);

    const indicatorsGroup = new THREE.Group();
    indicatorsGroupRef.current = indicatorsGroup;
    scene.add(indicatorsGroup);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [theme]);

  // Sync pieces with game
  useEffect(() => {
    const piecesGroup = piecesGroupRef.current;
    if (!piecesGroup) return;

    while (piecesGroup.children.length > 0) {
      const obj = piecesGroup.children[0];
      piecesGroup.remove(obj);
    }

    const themePalette = THEME_PALETTES[theme] || THEME_PALETTES.crimson;
    const board = game.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const sq = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
        const pos = squareToWorld(sq);
        const meshGroup = createPieceMesh(piece.type, piece.color, themePalette);
        meshGroup.position.set(pos.x, 0, pos.z);
        meshGroup.userData = { square: sq, piece };

        if (selectedSquare === sq) {
          meshGroup.position.y = 0.45;
        }
        piecesGroup.add(meshGroup);
      }
    }
  }, [game, theme, playerColor, selectedSquare, squareToWorld, createPieceMesh]);

  // Render highlights
  useEffect(() => {
    const indicators = indicatorsGroupRef.current;
    if (!indicators) return;

    while (indicators.children.length > 0) {
      const obj = indicators.children[0];
      indicators.remove(obj);
    }

    if (selectedSquare) {
      const pos = squareToWorld(selectedSquare);
      const selMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.65,
      });
      const selGeo = new THREE.PlaneGeometry(0.96, 0.96);
      const selMesh = new THREE.Mesh(selGeo, selMat);
      selMesh.rotation.x = -Math.PI / 2;
      selMesh.position.set(pos.x, 0.01, pos.z);
      indicators.add(selMesh);
    }

    for (const dest of legalMoves) {
      const pos = squareToWorld(dest as Square);
      const ringGeo = new THREE.RingGeometry(0.18, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.set(pos.x, 0.02, pos.z);
      indicators.add(ringMesh);
    }

    if (isCheck) {
      const turn = game.turn();
      const board = game.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece && piece.type === 'k' && piece.color === turn) {
            const sq = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
            const pos = squareToWorld(sq);
            const checkGeo = new THREE.RingGeometry(0.35, 0.46, 24);
            const checkMat = new THREE.MeshBasicMaterial({
              color: 0xff0033,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.9
            });
            const checkMesh = new THREE.Mesh(checkGeo, checkMat);
            checkMesh.rotation.x = -Math.PI / 2;
            checkMesh.position.set(pos.x, 0.03, pos.z);
            indicators.add(checkMesh);
          }
        }
      }
    }
  }, [selectedSquare, legalMoves, isCheck, game, squareToWorld]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.button === 0) {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi + deltaY * 0.008));
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    updateCameraPosition();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = Math.abs(e.clientX - prevMouseRef.current.x) > 3 || Math.abs(e.clientY - prevMouseRef.current.y) > 3;
    isDraggingRef.current = false;
    if (!wasDragging && containerRef.current && cameraRef.current && sceneRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj && obj !== sceneRef.current) {
          if (obj.userData && obj.userData.square) {
            onSquareClick(obj.userData.square);
            return;
          }
          obj = obj.parent;
        }
        if (hit.point) {
          const sq = worldToSquare(hit.point.x, hit.point.z);
          if (sq) {
            onSquareClick(sq);
            return;
          }
        }
      }
    }
  };

  const rotateCamera = (dir: 'left' | 'right') => {
    if (dir === 'left') cameraAngleRef.current.theta += Math.PI / 8;
    if (dir === 'right') cameraAngleRef.current.theta -= Math.PI / 8;
    updateCameraPosition();
  };

  const resetCamera = () => {
    cameraAngleRef.current = { theta: 0, phi: Math.PI / 4, radius: 14 };
    setCameraZoom(14);
    updateCameraPosition();
  };

  const adjustZoom = (delta: number) => {
    const newRad = Math.max(8, Math.min(22, cameraAngleRef.current.radius + delta));
    cameraAngleRef.current.radius = newRad;
    setCameraZoom(newRad);
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-full min-h-[420px] md:min-h-[580px] flex items-center justify-center select-none overflow-hidden rounded-2xl shadow-2xl border border-red-500/20 bg-slate-950/80 backdrop-blur-md">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-red-500/30 shadow-lg text-xs text-slate-300">
        <button
          type="button"
          onClick={() => rotateCamera('left')}
          title="Rotate Left"
          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
        >
          ↺ 45°
        </button>
        <button
          type="button"
          onClick={() => rotateCamera('right')}
          title="Rotate Right"
          className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
        >
          ↻ 45°
        </button>
        <div className="w-px h-4 bg-white/20" />
        <button
          type="button"
          onClick={() => adjustZoom(-2)}
          title="Zoom In"
          className="px-2 py-1 hover:bg-white/10 hover:text-white rounded-lg font-mono"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => adjustZoom(2)}
          title="Zoom Out"
          className="px-2 py-1 hover:bg-white/10 hover:text-white rounded-lg font-mono"
        >
          -
        </button>
        <div className="w-px h-4 bg-white/20" />
        <button
          type="button"
          onClick={resetCamera}
          title="Reset Camera Angle"
          className="px-2 py-1 hover:bg-white/10 hover:text-red-400 rounded-lg font-tech text-[11px]"
        >
          RESET
        </button>
      </div>
      <div className="absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-red-500/30 text-[11px] text-red-300 font-tech">
        <span>🎮 Drag to orbit 3D camera</span>
      </div>
    </div>
  );
};
