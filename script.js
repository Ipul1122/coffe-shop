// 1. Initialize AOS (Animation on Scroll)
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // 2. Navbar Toggle Logic
        const btn = document.getElementById('menu-btn');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Close mobile menu when link clicked
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });

        // 3. Data & Filtering Logic
        let allMenuItems = [];
        const menuContainer = document.getElementById('menu-container');

        // Render Function
        const renderMenu = (items) => {
            menuContainer.innerHTML = '';
            if(items.length === 0) {
                menuContainer.innerHTML = '<p class="text-center col-span-full">Menu tidak ditemukan.</p>';
                return;
            }

            items.forEach((item, index) => {
                // Badge Logic
                let badgeHTML = '';
                if(item.badges && item.badges.length > 0) {
                    item.badges.forEach(badge => {
                        let colorClass = badge.includes('Food') ? 'bg-red-500' : (badge.includes('Favorite') ? 'bg-purple-500' : 'bg-brand-accent text-brand-dark');
                        badgeHTML += `<span class="absolute top-3 left-3 ${colorClass} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">${badge}</span>`;
                    });
                }

                // Card HTML
                const card = `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition duration-300 border border-gray-100" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="relative h-48 overflow-hidden">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            ${badgeHTML}
                            <div class="absolute bottom-0 right-0 bg-brand-primary text-white px-4 py-1 rounded-tl-xl font-bold">
                                ${item.price}
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-serif font-bold text-xl text-brand-dark">${item.name}</h3>
                                <div class="flex items-center text-yellow-500 text-sm">
                                    <span>★</span> <span class="text-gray-400 ml-1">${item.rating}</span>
                                </div>
                            </div>
                            <p class="text-gray-500 text-sm mb-4 line-clamp-2">${item.description}</p>
                            <button class="w-full py-2 border border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition font-medium text-sm">Add to Order</button>
                        </div>
                    </div>
                `;
                menuContainer.innerHTML += card;
            });
        };

        // Filter Function
        window.filterMenu = (category) => {
            // Update Buttons UI
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if(btn.dataset.filter === category) {
                    btn.classList.add('bg-brand-primary', 'text-white');
                    btn.classList.remove('text-brand-dark');
                } else {
                    btn.classList.remove('bg-brand-primary', 'text-white');
                    btn.classList.add('text-brand-dark');
                }
            });

            // Filter Data
            if(category === 'all') {
                renderMenu(allMenuItems);
            } else {
                const filtered = allMenuItems.filter(item => item.category === category);
                renderMenu(filtered);
            }
        };

        // 4. Fetch Data with Axios
        const fetchMenuData = async () => {
            try {
                const response = await axios.get('menu.json');
                allMenuItems = response.data;
                renderMenu(allMenuItems);
            } catch (error) {
                console.error("Gagal mengambil data JSON (Mungkin masalah CORS file://):", error);
                
                const fallbackData = [
                    { id: 1, name: "Caramel Macchiato", description: "Espresso, steamed milk, vanilla syrup, caramel drizzle.", price: "IDR 35.000", category: "coffee", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80", rating: 4.9, badges: ["Customer Favorite"] },
                    { id: 2, name: "Ice Lemon Tea", description: "Segar dan dingin, perpaduan teh dan lemon.", price: "IDR 18.000", category: "non-coffee", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", rating: 4.5, badges: [] },
                    { id: 3, name: "Beef Burger", description: "Burger daging sapi premium.", price: "IDR 55.000", category: "food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", rating: 4.8, badges: ["Best Food"] }
                ];
                allMenuItems = fallbackData;
                renderMenu(allMenuItems);
                
                const errMsg = document.createElement('div');
                errMsg.className = 'text-center text-xs text-red-400 mt-2';
                errMsg.innerText = '*Running in Fallback Mode (Check Console for CORS info)';
                menuContainer.after(errMsg);
            }
        };

        // Initialize
        fetchMenuData();

        // 5. Scroll To Top Logic
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('translate-y-20', 'opacity-0');
            } else {
                scrollToTopBtn.classList.add('translate-y-20', 'opacity-0');
            }
        });

        // Menangani klik tombol
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });