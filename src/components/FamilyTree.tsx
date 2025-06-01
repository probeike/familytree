'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Person, Relationship, TreeNode, TreeLink } from '@/types';

interface FamilyTreeProps {
  people: Person[];
  relationships: Relationship[];
  rootPersonId?: string;
  width?: number;
  height?: number;
}

export default function FamilyTree({ 
  people, 
  relationships, 
  rootPersonId, 
  width = 1200, 
  height = 800 
}: FamilyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!svgRef.current || people.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create tree data
    const { nodes, links } = createTreeData(people, relationships, rootPersonId);
    
    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = svg.append('g').attr('class', 'tree-container');

    // Set up zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation<TreeNode>(nodes)
      .force('link', d3.forceLink<TreeNode, TreeLink>(links)
        .id((d) => d.id)
        .distance(100)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Create links
    const link = container.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', (d) => getLinkColor(d.type))
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Create nodes
    const node = container.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, TreeNode>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Add circles for nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d) => getNodeColor(d.person))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node.append('text')
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text((d) => `${d.person.firstName} ${d.person.lastName}`);

    // Add birth/death years
    node.append('text')
      .attr('dy', 48)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text((d) => {
        const birth = extractYear(d.person.birthDate);
        const death = extractYear(d.person.deathDate);
        if (birth && death) return `${birth}-${death}`;
        if (birth) return `b. ${birth}`;
        return '';
      });

    // Add click handlers
    node.on('click', (event, d) => {
      event.stopPropagation();
      setSelectedPerson(d.person);
    });

    // Add hover effects
    node.on('mouseenter', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 25)
        .attr('stroke-width', 3);
      
      // Show tooltip
      showTooltip(event, d.person);
    });

    node.on('mouseleave', function() {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 20)
        .attr('stroke-width', 2);
      
      hideTooltip();
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as TreeNode).x!)
        .attr('y1', (d) => (d.source as TreeNode).y!)
        .attr('x2', (d) => (d.target as TreeNode).x!)
        .attr('y2', (d) => (d.target as TreeNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragStarted(event: d3.D3DragEvent<SVGGElement, TreeNode, TreeNode>, d: TreeNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, TreeNode, TreeNode>, d: TreeNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<SVGGElement, TreeNode, TreeNode>, d: TreeNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Clear selection when clicking on empty space
    svg.on('click', () => setSelectedPerson(null));

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [people, relationships, rootPersonId, width, height]);

  const centerTree = () => {
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(
        (d3.zoom<SVGSVGElement, unknown>() as any).transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
      );
  };

  const zoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      (d3.zoom<SVGSVGElement, unknown>() as any).scaleBy,
      1.5
    );
  };

  const zoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      (d3.zoom<SVGSVGElement, unknown>() as any).scaleBy,
      1 / 1.5
    );
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-2 space-y-2">
        <button
          onClick={zoomIn}
          className="block w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="block w-8 h-8 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={centerTree}
          className="block w-8 h-8 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center justify-center text-xs"
          title="Center"
        >
          ⌂
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md px-3 py-1 text-sm text-gray-600">
        {Math.round(zoomLevel * 100)}%
      </div>

      {/* SVG Tree */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-gray-50"
      />

      {/* Selected Person Info */}
      {selectedPerson && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-bold text-lg mb-2">
            {selectedPerson.firstName} {selectedPerson.lastName}
          </h3>
          {selectedPerson.birthDate && (
            <p className="text-sm text-gray-600 mb-1">
              Born: {selectedPerson.birthDate}
              {selectedPerson.birthPlace && ` in ${selectedPerson.birthPlace}`}
            </p>
          )}
          {selectedPerson.deathDate && (
            <p className="text-sm text-gray-600 mb-1">
              Died: {selectedPerson.deathDate}
              {selectedPerson.deathPlace && ` in ${selectedPerson.deathPlace}`}
            </p>
          )}
          {selectedPerson.occupation && (
            <p className="text-sm text-gray-600 mb-2">
              Occupation: {selectedPerson.occupation}
            </p>
          )}
          <button
            onClick={() => window.open(`/person/${selectedPerson.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-md p-3">
        <h4 className="font-medium text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>Parent-Child</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>Spouse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span>Sibling</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function createTreeData(people: Person[], relationships: Relationship[], rootPersonId?: string) {
  // Create nodes
  const nodes: TreeNode[] = people.map(person => ({
    id: person.id,
    person,
    generation: 0,
    depth: 0
  }));

  // Create links
  const links: TreeLink[] = relationships.map(rel => ({
    id: rel.id,
    source: rel.person1Id,
    target: rel.person2Id,
    type: rel.type as 'parent' | 'spouse' | 'sibling'
  }));

  return { nodes, links };
}

function getNodeColor(person: Person): string {
  if (person.deathDate) return '#ef4444'; // Red for deceased
  if (person.birthDate) {
    const year = extractYear(person.birthDate);
    const age = new Date().getFullYear() - year;
    if (age < 18) return '#22c55e'; // Green for children
    if (age < 65) return '#3b82f6'; // Blue for adults
    return '#f59e0b'; // Orange for elderly
  }
  return '#6b7280'; // Gray for unknown
}

function getLinkColor(type: string): string {
  switch (type) {
    case 'parent':
    case 'child':
      return '#3b82f6'; // Blue for parent-child
    case 'spouse':
      return '#ef4444'; // Red for spouse
    case 'sibling':
      return '#22c55e'; // Green for sibling
    default:
      return '#6b7280'; // Gray for other
  }
}

function extractYear(dateString?: string): number {
  if (!dateString) return 0;
  const match = dateString.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

function showTooltip(event: MouseEvent, person: Person) {
  // This would create a tooltip - simplified for now
  console.log('Show tooltip for:', person.firstName, person.lastName);
}

function hideTooltip() {
  // This would hide the tooltip - simplified for now
  console.log('Hide tooltip');
}