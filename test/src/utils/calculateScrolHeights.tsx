interface Section {
    readonly name: string;
    readonly component: React.ComponentType;
    readonly height: string;
    readonly parallaxSpeed?: number;
}

export const calculateScrollHeights = (sections: readonly Section[]) => {
    const parallaxOffset = Math.max(
        ...sections.map(section => section.parallaxSpeed || 0)
    );

    const totalHeight = sections.reduce((acc, section) => {
        const height = section.height.replace('vh', '');
        return acc + parseInt(height);
    }, 0);

    console.group('calculateScrollHeights')
    console.log('Parallax Speeds', sections.map(section => section.parallaxSpeed))
    console.log('maxParallaxOffset', parallaxOffset)
    console.log('totalHeight', totalHeight)
    console.groupEnd()

    return {
        parallaxOffset,
        totalHeight
    };
};