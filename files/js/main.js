class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
    <div class="footer">
    <!-- 
        <form class="form padding-24 rounded-corners" name="contact" method="POST" data-netlify="true">
            <h5 id="newsletter">Subscribe to our Newsletter</h5>
            <label>Full Name* <input type="text" name="name" required /></label>
            <label>Email* <input type="email" name="email" required /></label>
            <p>
                <button class="secondary-btn button-text" type="submit">Subscribe</button>
            </p>
        </form>

        <ul class="footer-list-1">
            <p class="footer-link-large">Explore</p>
            <li><a class="footer-link" href="./index.html">Home</a></li>
            <li><a class="footer-link" href="./timeline.html">Timeline</a></li>
            <li><a class="footer-link" href="./shop.html">Shop</a></li>
            <li><a class="footer-link" href="./videos.html">Videos</a></li>
            <li><a class="footer-link" href="./about.html">About</a></li>
            <li><a class="footer-link" href="./contact.html">Contact</a></li>
        </ul>

        <ul class="footer-list-2">
            <p class="footer-link-large">Merchandise</p>
            <li><a class="footer-link" href="./shop.html#apparel">Apparel</a></li>
            <li><a class="footer-link" href="./shop.html#memorabilia">Memorabilia</a></li>
            <li><a class="footer-link" href="./shop.html#accessories">Accessories</a></li>
            <li><a class="footer-link" href="./shop.html#new-arrivals">New Arrivals</a></li>
            <li><a class="footer-link" href="./shop.html#best-sellers">Best Sellers</a></li>
        </ul>

        <ul class="footer-list-3">
            <p class="footer-link-large">Resources</p>
            <li><a class="footer-link" href="./blog.html">Blog</a></li>
            <li><a class="footer-link" href="./faq.html">FAQ</a></li>
            <li><a class="footer-link" href="./support.html">Support</a></li>
            <li><a class="footer-link" href="./historical-articles.html">Historical Articles</a></li>
            <li><a class="footer-link" href="./events.html">Events & Webinars</a></li>
        </ul>
                -->

<div class="container-full">
            <a class=" footer-link" href="./index.html">© Unique UX - Baldwin IV</a>
            <p class=" footer-link">Designed by Unique UX</p>
            <p class=" footer-link">Contact: uniqueux13@gmail.com</p>
        </div>
    </div>
</footer>

        `
    }
}

customElements.define('my-footer', MyFooter )
