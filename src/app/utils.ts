    // Chart configuration - easily adjustable
  export const chartConfig = {
        height: 200, // Chart container height in pixels (reduced from 320px)
        paddingLeft: 48, // pl-12 = 48px
        paddingRight: 16, // pr-4 = 16px  
        paddingBottom: 48, // pb-12 = 48px
        barWidth: 48, // w-12 = 48px
        maxValue: 100 // Maximum value for scaling
    };

    // Calculate responsive dimensions
  export const chartHeight = `${chartConfig.height}px`;
  export const chartAreaHeight = chartConfig.height - chartConfig.paddingBottom;

    // Sample data for charts
  export const categoryData = [
        { name: "Business", shortName: "Busine...", value: 100, color: "#8b5cf6" },
        { name: "IT", shortName: "IT", value: 22, color: "#6d28d9" },
        { name: "Finance", shortName: "Finance", value: 65, color: "#c4b5fd" },
        { name: "Shopping", shortName: "Sho...", value: 35, color: "#ddd6fe" },
        { name: "Government", shortName: "Govern...", value: 22, color: "#8b5cf6" },
        { name: "Search", shortName: "Search...", value: 15, color: "#e9d5ff" },
    ];

  export const riskyWebsites = [
        { domain: 'viewadomain.provider.app', visits: 30, users: 3, tag: 'Free ho...', icon: '🔵', image: "/Avatar.png" },
        { domain: 'viewadomain.search.app', visits: 24, users: 5, tag: 'Free ho...', icon: '🟡', image: "/Avatar1.png" },
        { domain: 'ledgecontent.webflow.io', visits: 19, users: 7, tag: 'Malicio...', icon: '🔵', image: "/Avatar2.png" },
        { domain: 'viewadomain.facebook.app', visits: 10, users: 10, tag: 'Free ho...', icon: '🔵', image: "/Avatar3.png" }
    ];

  export const mostVisitedDomains = [
        { domain: 'viewadomain.provider.app', visits: 30, users: 3, icon: '🔵', image: "/Avatar.png" },
        { domain: 'viewadomain.search.app', visits: 24, users: 5, icon: '🟡', image: "/Avatar1.png" },
        { domain: 'ledgecontent.webflow.io', visits: 19, users: 7, icon: '🔵', image: "/Avatar2.png" },
        { domain: 'viewadomain.facebook.app', visits: 10, users: 10, icon: '🔵', image: "/Avatar3.png" }
    ];

  export const riskyCategories = [
        { name: 'Free Hosted', percentage: 40, count: 18, color: 'bg-purple-200' },
        { name: 'Typosquatting', percentage: 8, count: 5, color: 'bg-purple-300' },
        { name: 'New Domain', percentage: 50, count: 30, color: 'bg-purple-400' },
        { name: 'Free Hosted', percentage: 20, count: 9, color: 'bg-purple-200' }
    ];