import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TagNode {
  id: string;
  name: string;
  occurrences: number;
  group: number;
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface TagLink {
  source: string | TagNode;
  target: string | TagNode;
  cooccurrence: number;
  strength: number;
}

interface PsychocatcherProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Psychocatcher({ width = 800, height = 500, className = "" }: PsychocatcherProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<TagNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données simulées basées sur la méthode Courtial
  const nodes: TagNode[] = [
    // Communauté Psyché (groupe 1) - centrale et dense
    { id: 'psyche', name: 'psyché', occurrences: 52, group: 1, size: 25 },
    { id: 'ame', name: 'âme', occurrences: 31, group: 1, size: 18 },
    { id: 'esprit', name: 'esprit', occurrences: 28, group: 1, size: 16 },
    { id: 'conscience', name: 'conscience', occurrences: 24, group: 1, size: 15 },
    { id: 'introspection', name: 'introspection', occurrences: 19, group: 1, size: 12 },
    
    // Communauté Nature (groupe 2)
    { id: 'nature', name: 'nature', occurrences: 47, group: 2, size: 22 },
    { id: 'foret', name: 'forêt', occurrences: 23, group: 2, size: 14 },
    { id: 'ocean', name: 'océan', occurrences: 18, group: 2, size: 11 },
    { id: 'montagne', name: 'montagne', occurrences: 15, group: 2, size: 10 },
    
    // Communauté Temporelle (groupe 3)
    { id: 'temps', name: 'temps', occurrences: 39, group: 3, size: 20 },
    { id: 'memoire', name: 'mémoire', occurrences: 33, group: 3, size: 17 },
    { id: 'passe', name: 'passé', occurrences: 26, group: 3, size: 15 },
    { id: 'futur', name: 'futur', occurrences: 21, group: 3, size: 13 },
    { id: 'instant', name: 'instant', occurrences: 16, group: 3, size: 11 },
    
    // Communauté Émotions (groupe 4)
    { id: 'amour', name: 'amour', occurrences: 35, group: 4, size: 18 },
    { id: 'melancolie', name: 'mélancolie', occurrences: 29, group: 4, size: 16 },
    { id: 'joie', name: 'joie', occurrences: 22, group: 4, size: 13 },
    { id: 'nostalgie', name: 'nostalgie', occurrences: 20, group: 4, size: 12 },
    
    // Communauté Artistique (groupe 5)
    { id: 'poesie', name: 'poésie', occurrences: 30, group: 5, size: 16 },
    { id: 'musique', name: 'musique', occurrences: 25, group: 5, size: 14 },
    { id: 'creation', name: 'création', occurrences: 22, group: 5, size: 13 },
    { id: 'beaute', name: 'beauté', occurrences: 18, group: 5, size: 11 }
  ];

  const links: TagLink[] = [
    // Liens intra-communautés (cooccurrence forte)
    { source: 'psyche', target: 'ame', cooccurrence: 15, strength: 0.8 },
    { source: 'psyche', target: 'esprit', cooccurrence: 12, strength: 0.7 },
    { source: 'ame', target: 'conscience', cooccurrence: 9, strength: 0.6 },
    { source: 'esprit', target: 'introspection', cooccurrence: 8, strength: 0.5 },
    
    { source: 'nature', target: 'foret', cooccurrence: 11, strength: 0.7 },
    { source: 'nature', target: 'ocean', cooccurrence: 8, strength: 0.6 },
    { source: 'foret', target: 'montagne', cooccurrence: 6, strength: 0.4 },
    
    { source: 'temps', target: 'memoire', cooccurrence: 14, strength: 0.8 },
    { source: 'memoire', target: 'passe', cooccurrence: 10, strength: 0.6 },
    { source: 'temps', target: 'futur', cooccurrence: 9, strength: 0.5 },
    { source: 'passe', target: 'nostalgie', cooccurrence: 7, strength: 0.5 },
    
    { source: 'amour', target: 'joie', cooccurrence: 8, strength: 0.6 },
    { source: 'melancolie', target: 'nostalgie', cooccurrence: 9, strength: 0.7 },
    
    { source: 'poesie', target: 'creation', cooccurrence: 10, strength: 0.7 },
    { source: 'musique', target: 'beaute', cooccurrence: 7, strength: 0.5 },
    
    // Liens inter-communautés (cooccurrence modérée)
    { source: 'psyche', target: 'temps', cooccurrence: 6, strength: 0.4 },
    { source: 'ame', target: 'nature', cooccurrence: 5, strength: 0.3 },
    { source: 'memoire', target: 'melancolie', cooccurrence: 8, strength: 0.5 },
    { source: 'creation', target: 'psyche', cooccurrence: 7, strength: 0.4 },
    { source: 'nature', target: 'beaute', cooccurrence: 6, strength: 0.4 },
    { source: 'temps', target: 'poesie', cooccurrence: 5, strength: 0.3 },
    { source: 'amour', target: 'creation', cooccurrence: 6, strength: 0.4 }
  ];

  const groupColors: Record<number, string> = {
    1: '#3b82f6', // Psyché - Bleu
    2: '#10b981', // Nature - Vert émeraude
    3: '#f59e0b', // Temporel - Ambre
    4: '#ec4899', // Émotions - Rose
    5: '#8b5cf6'  // Artistique - Violet
  };

  useEffect(() => {
    try {
      if (!svgRef.current) {
        setError("SVG ref non disponible");
        return;
      }

      setError(null);
      const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Configuration des dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Configuration du SVG
    svg.attr("width", width)
       .attr("height", height)
       .attr("viewBox", `0 0 ${width} ${height}`)
       .style("border", "1px solid #334155");

    // Conteneur principal avec zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Simulation de force pour le réseau
    const simulation = d3.forceSimulation<TagNode>(nodes)
      .force("link", d3.forceLink<TagNode, TagLink>(links)
        .id(d => d.id)
        .distance(d => 100 + (1 - d.strength) * 100)
        .strength(d => d.strength * 0.8))
      .force("charge", d3.forceManyBody<TagNode>()
        .strength(d => -400 - d.size * 10))
      .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force("collision", d3.forceCollide<TagNode>()
        .radius(d => d.size + 10));

    // Groupe pour les liens
    const linkGroup = g.append("g").attr("class", "links");
    
    // Création des liens avec épaisseur variable
    const link = linkGroup
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.max(1, Math.sqrt(d.cooccurrence) * 2))
      .style("cursor", "pointer");

    // Labels de cooccurrence sur les liens importants
    const linkLabelGroup = g.append("g").attr("class", "link-labels");
    
    const linkLabels = linkLabelGroup
      .selectAll("text")
      .data(links.filter(d => d.cooccurrence >= 8))
      .enter().append("text")
      .attr("font-size", "10px")
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "middle")
      .attr("dy", -3)
      .text(d => d.cooccurrence)
      .style("pointer-events", "none")
      .style("opacity", 0.8)
      .style("font-weight", "bold");

    // Groupe pour les nœuds
    const nodeGroup = g.append("g").attr("class", "nodes");
    
    // Groupes de nœuds avec drag and drop
    const nodeGroups = nodeGroup
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "grab")
      .call(d3.drag<SVGGElement, TagNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
          d3.select(event.currentTarget).style("cursor", "grabbing");
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          d3.select(event.currentTarget).style("cursor", "grab");
        }));

    // Cercles de pulsation pour les nœuds centraux
    const pulsingCircles = nodeGroups
      .filter(d => d.occurrences > 30)
      .append("circle")
      .attr("r", d => d.size + 12)
      .attr("fill", "none")
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", 3)
      .attr("stroke-opacity", 0.4)
      .style("animation", "pulse 3s ease-in-out infinite");

    // CSS pour l'animation de pulsation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { 
          stroke-opacity: 0.2; 
          r: ${Math.max(...nodes.map(n => n.size)) + 8};
        }
        50% { 
          stroke-opacity: 0.8; 
          r: ${Math.max(...nodes.map(n => n.size)) + 15};
        }
      }
    `;
    document.head.appendChild(style);

    // Cercles principaux des nœuds
    const circles = nodeGroups.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => groupColors[d.group])
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 3)
      .style("opacity", 0.9)
      .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))");

    // Fond pour les labels (améliore la lisibilité)
    const labelBackgrounds = nodeGroups.append("rect")
      .attr("width", d => d.name.length * Math.max(8, Math.min(12, d.size * 0.6)))
      .attr("height", d => Math.max(12, Math.min(16, d.size * 0.8)))
      .attr("x", d => -(d.name.length * Math.max(8, Math.min(12, d.size * 0.6))) / 2)
      .attr("y", d => -(Math.max(12, Math.min(16, d.size * 0.8))) / 2)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", "rgba(15, 23, 42, 0.85)")
      .attr("stroke", "rgba(148, 163, 184, 0.3)")
      .attr("stroke-width", 1)
      .style("pointer-events", "none");

    // Labels des nœuds
    const labels = nodeGroups.append("text")
      .text(d => d.name)
      .attr("font-size", d => Math.max(10, Math.min(14, d.size * 0.7)))
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.9)")
      .style("user-select", "none");

    // Interactions
    nodeGroups
      .on("mouseenter", (event, d) => {
        setSelectedNode(d);
        
        // Highlight du nœud
        d3.select(event.currentTarget).select("circle")
          .transition().duration(200)
          .attr("r", d.size * 1.3)
          .style("opacity", 1);

        // Highlight des liens connectés
        link
          .style("opacity", l => 
            (l.source === d || l.target === d) ? 0.8 : 0.1)
          .attr("stroke", l => 
            (l.source === d || l.target === d) ? groupColors[d.group] : "#64748b");

        // Highlight des nœuds connectés
        circles
          .style("opacity", n => {
            const isConnected = links.some(l => 
              (l.source === d && l.target === n) || 
              (l.target === d && l.source === n)
            );
            return isConnected || n === d ? 1 : 0.3;
          });
      })
      .on("mouseleave", () => {
        setSelectedNode(null);
        
        // Reset tous les styles
        circles
          .transition().duration(200)
          .attr("r", d => d.size)
          .style("opacity", 0.9);

        // Reset le fond des labels
        labelBackgrounds
          .transition().duration(200)
          .attr("fill", "rgba(15, 23, 42, 0.85)")
          .attr("stroke", "rgba(148, 163, 184, 0.3)");

        // Reset les labels
        labels
          .transition().duration(200)
          .attr("font-size", d => Math.max(10, Math.min(14, d.size * 0.7)))
          .style("fill", "#ffffff");

        link
          .transition().duration(200)
          .style("opacity", 0.4)
          .attr("stroke", "#64748b");
      });

    // Update positions à chaque tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as TagNode).x!)
        .attr("y1", d => (d.source as TagNode).y!)
        .attr("x2", d => (d.target as TagNode).x!)
        .attr("y2", d => (d.target as TagNode).y!);

      linkLabels
        .attr("x", d => ((d.source as TagNode).x! + (d.target as TagNode).x!) / 2)
        .attr("y", d => ((d.source as TagNode).y! + (d.target as TagNode).y!) / 2);

      nodeGroups
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

      // Marquer comme chargé
      setIsLoaded(true);
      setError(null);

      // Nettoyage
      return () => {
        simulation.stop();
      };

    } catch (err) {
      setError(`Erreur D3: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setIsLoaded(false);
    }
  }, [width, height]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.75
    );
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  return (
    <Card className={`border-slate-800 bg-slate-950/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Sparkles className="w-5 h-5 text-orange-400" />
            Psychocatcher des Résonances
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Badge variant="outline" className="text-xs">
              Zoom: {Math.round(zoomLevel * 100)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-slate-400 text-sm mb-2">
            Réseau interactif de vos tags basé sur les co-occurrences. 
            Taille = fréquence d'usage, épaisseur des liens = force d'association.
          </p>
          {selectedNode && (
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: groupColors[selectedNode.group] }}
                />
                <span className="font-medium text-slate-200">{selectedNode.name}</span>
              </div>
              <div className="text-xs text-slate-400">
                {selectedNode.occurrences} occurrences dans vos psychographies
              </div>
            </div>
          )}
        </div>
        
        <div className="relative bg-slate-900/30 rounded-lg overflow-hidden">
          {error && (
            <div className="p-4 text-center">
              <div className="text-red-400 mb-2">⚠️ Erreur de chargement</div>
              <div className="text-sm text-slate-400">{error}</div>
            </div>
          )}
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-400 animate-pulse">Chargement du réseau...</div>
            </div>
          )}
          
          <svg 
            ref={svgRef} 
            className="w-full" 
            style={{ height: `${height}px`, minHeight: '400px' }}
            viewBox={`0 0 ${width} ${height}`}
          />
        </div>

        {/* Légende des communautés */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {Object.entries(groupColors).map(([group, color]) => {
            const groupNames: Record<string, string> = {
              '1': 'Psyché',
              '2': 'Nature', 
              '3': 'Temporel',
              '4': 'Émotions',
              '5': 'Artistique'
            };
            return (
              <div key={group} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-400">{groupNames[group]}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}