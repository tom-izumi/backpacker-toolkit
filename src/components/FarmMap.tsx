'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import circle from '@turf/circle';
import type { Farm } from '@/lib/types';

// 兩區域城鎮中心概略座標，僅用於決定地圖初始視角
const CABOOLTURE_CENTER: [number, number] = [152.9503, -27.0853];
const STANTHORPE_CENTER: [number, number] = [151.9433, -28.6506];

interface FarmMapProps {
  farms: Farm[];
}

export default function FarmMap({ farms }: FarmMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapContainer.current || mapRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [
        (CABOOLTURE_CENTER[0] + STANTHORPE_CENTER[0]) / 2,
        (CABOOLTURE_CENTER[1] + STANTHORPE_CENTER[1]) / 2,
      ],
      zoom: 6,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.fitBounds(
        [
          [
            Math.min(CABOOLTURE_CENTER[0], STANTHORPE_CENTER[0]) - 0.5,
            Math.min(CABOOLTURE_CENTER[1], STANTHORPE_CENTER[1]) - 0.5,
          ],
          [
            Math.max(CABOOLTURE_CENTER[0], STANTHORPE_CENTER[0]) + 0.5,
            Math.max(CABOOLTURE_CENTER[1], STANTHORPE_CENTER[1]) + 0.5,
          ],
        ],
        { padding: 40, duration: 0 },
      );

      map.addSource('farm-circles', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'farm-circles-fill',
        type: 'fill',
        source: 'farm-circles',
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'farm-circles-outline',
        type: 'line',
        source: 'farm-circles',
        paint: {
          'line-color': '#2563eb',
          'line-width': 1.5,
          'line-opacity': 0.6,
        },
      });

      map.on('click', 'farm-circles-fill', (e) => {
        const feature = e.features?.[0];
        if (!feature?.properties) return;
        const { id, name, crop, job_type } = feature.properties as {
          id: string;
          name: string;
          crop: string;
          job_type: string;
        };

        const popupNode = document.createElement('div');
        popupNode.style.fontFamily = 'inherit';
        popupNode.style.minWidth = '160px';

        const title = document.createElement('strong');
        title.style.display = 'block';
        title.style.marginBottom = '4px';
        title.textContent = name;

        const subtitle = document.createElement('div');
        subtitle.style.cssText = 'font-size:13px;color:#555;margin-bottom:8px';
        subtitle.textContent = `${crop} · ${job_type}`;

        const btn = document.createElement('button');
        btn.textContent = '查看詳情';
        btn.style.cssText =
          'font-size:13px;padding:4px 10px;border-radius:6px;background:#2563eb;color:white;border:none;cursor:pointer';
        btn.addEventListener('click', () => router.push(`/farms/${id}`));

        popupNode.appendChild(title);
        popupNode.appendChild(subtitle);
        popupNode.appendChild(btn);

        new mapboxgl.Popup({ closeButton: true })
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(map);
      });

      map.on('mouseenter', 'farm-circles-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'farm-circles-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [router]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSource = () => {
      const source = map.getSource('farm-circles') as
        | mapboxgl.GeoJSONSource
        | undefined;
      if (!source) return;

      const features = farms.map((farm) =>
        circle([farm.approx_lng, farm.approx_lat], farm.fuzzy_radius_m / 1000, {
          steps: 64,
          units: 'kilometers',
          properties: {
            id: farm.id,
            name: farm.name,
            crop: farm.crop,
            job_type: farm.job_type,
          },
        }),
      );

      source.setData({ type: 'FeatureCollection', features });
    };

    if (map.isStyleLoaded()) {
      updateSource();
    } else {
      map.once('load', updateSource);
    }
  }, [farms]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-6 text-center text-sm text-slate-500">
        尚未設定 NEXT_PUBLIC_MAPBOX_TOKEN，地圖無法顯示。
        <br />
        請於 .env.local 補上 Mapbox access token。
      </div>
    );
  }

  return <div ref={mapContainer} className="h-full w-full" />;
}
