'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import circle from '@turf/circle';
import type { Farm } from '@/lib/types';

// 兩區域城鎮中心概略座標，僅用於決定地圖初始視角
const CABOOLTURE_CENTER: [number, number] = [152.9503, -27.0853];
const STANTHORPE_CENTER: [number, number] = [151.9433, -28.6506];

const ACCENT = '#22d3ee';

interface FarmMapProps {
  farms: Farm[];
  onSelectFarm: (id: string) => void;
  focusFarm: Farm | null;
}

export default function FarmMap({ farms, onSelectFarm, focusFarm }: FarmMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onSelectFarmRef = useRef(onSelectFarm);

  useEffect(() => {
    onSelectFarmRef.current = onSelectFarm;
  }, [onSelectFarm]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapContainer.current || mapRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
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

      // 底層：模糊定位範圍圓圈
      map.addSource('farm-circles', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'farm-circles-fill',
        type: 'fill',
        source: 'farm-circles',
        paint: {
          'fill-color': ACCENT,
          'fill-opacity': 0.12,
        },
      });

      map.addLayer({
        id: 'farm-circles-outline',
        type: 'line',
        source: 'farm-circles',
        paint: {
          'line-color': ACCENT,
          'line-width': 1.5,
          'line-opacity': 0.5,
        },
      });

      // 上層：群聚標記
      map.addSource('farm-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'farm-points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ACCENT,
          'circle-opacity': 0.85,
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16,
            5,
            20,
            10,
            26,
          ],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'farm-points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#0a0b0d',
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'farm-points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ACCENT,
          'circle-radius': 7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0a0b0d',
        },
      });

      map.on('click', 'clusters', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const clusterId = feature.properties?.cluster_id;
        const source = map.getSource('farm-points') as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [
            number,
            number,
          ];
          map.easeTo({ center: coords, zoom });
        });
      });

      map.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0];
        const id = feature?.properties?.id as string | undefined;
        if (id) onSelectFarmRef.current(id);
      });

      for (const layerId of ['clusters', 'unclustered-point']) {
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSources = () => {
      const circleSource = map.getSource('farm-circles') as
        | mapboxgl.GeoJSONSource
        | undefined;
      const pointSource = map.getSource('farm-points') as
        | mapboxgl.GeoJSONSource
        | undefined;
      if (!circleSource || !pointSource) return;

      const circleFeatures = farms.map((farm) =>
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
      circleSource.setData({ type: 'FeatureCollection', features: circleFeatures });

      const pointFeatures: GeoJSON.Feature<GeoJSON.Point>[] = farms.map((farm) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [farm.approx_lng, farm.approx_lat] },
        properties: {
          id: farm.id,
          name: farm.name,
          crop: farm.crop,
          job_type: farm.job_type,
        },
      }));
      pointSource.setData({ type: 'FeatureCollection', features: pointFeatures });
    };

    if (map.isStyleLoaded()) {
      updateSources();
    } else {
      map.once('load', updateSources);
    }
  }, [farms]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusFarm) return;

    const run = () => {
      // 用模糊定位半徑換算經緯度範圍，讓地圖鏡頭聚焦並縮放到該農場的模糊範圍
      const latRad = (focusFarm.approx_lat * Math.PI) / 180;
      const dLat = focusFarm.fuzzy_radius_m / 111320;
      const dLng =
        focusFarm.fuzzy_radius_m / (111320 * Math.cos(latRad));

      map.fitBounds(
        [
          [focusFarm.approx_lng - dLng, focusFarm.approx_lat - dLat],
          [focusFarm.approx_lng + dLng, focusFarm.approx_lat + dLat],
        ],
        { padding: 80, duration: 900, maxZoom: 15 },
      );
    };

    if (map.isStyleLoaded()) {
      run();
    } else {
      map.once('load', run);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusFarm?.id]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface p-6 text-center text-sm text-muted">
        尚未設定 NEXT_PUBLIC_MAPBOX_TOKEN，地圖無法顯示。
        <br />
        請於 .env.local 補上 Mapbox access token。
      </div>
    );
  }

  return <div ref={mapContainer} className="h-full w-full" />;
}
