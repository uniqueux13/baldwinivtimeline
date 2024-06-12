class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
        <div class="footer">
            <form class="form padding-24 rounded-corners" name="contact" method="POST" data-netlify="true">
                <h5 id="request-quote">Request a quote</h5>
                <label>Full Name* <input type="text" name="name" /></label>
                <label>Email* <input type="email" name="email" /></label>
                <label>Phone* <input type="phone" name="name" /></label>
                <label class="grid">Are you a new customer?
                    <select name="role[]">
                        <option value="new-customer">Yes, I'm a new customer</option>
                        <option value="exsisting-customer">No, I'm an exsisting customer</option>
                        <option value="other">I'm neither</option>
                    </select></label>
                <p>
                    <label>Please describe your plumbing issue: <textarea name="message"></textarea></label>
                </p>
                <p>
                    <button class="secondary-btn button-text" type="submit">Submit Request</button>
                </p>
            </form>

            <ul class="footer-list-1">
                <p class="footer-link-large">For Homeowners</p>
                <li><a class="footer-link" href="#">Residential Plumbing</a></li>
                <li><a class="footer-link" href="water.html">Water</a></li>
                <li><a class="footer-link" href="naturalGas.html">Natural Gas</a>
                <li><a class="footer-link" href="sewer.html">Sewer</a></li>
                <li><a class="footer-link" href="toilets.html">Toilets</a></li>
                <li><a class="footer-link" href="faucets.html">Faucets</a>
                <li><a class="footer-link" href="tubsAndShowers.html">Tubs & Showers</a></li>
                <li><a class="footer-link" href="water-heaters.html">Water-heaters</a></li>
                <li><a class="footer-link" href="waterSofteners.html">Water Softeners</a></li>
                <li><a class="footer-link" href="sumpPumps.html">Sump Pumps</a></li>
            </ul>

            <ul class="footer-list-2">
                <p class="footer-link-large">For Businesses</p>
                <li><a class="footer-link" href="#">Commercial Plumbing</a></li>
                <li><a class="footer-link" href="water.html">Water</a></li>
                <li><a class="footer-link" href="naturalGas.html">Natural Gas</a>
                <li><a class="footer-link" href="sewer.html">Sewer</a></li>
                <li><a class="footer-link" href="toilets.html">Toilets</a></li>
                <li><a class="footer-link" href="toilets.html">Urnials</a></li>
                <li><a class="footer-link" href="faucets.html">Faucets</a>
                <li><a class="footer-link" href="faucets.html">Water-heaters</a>
            </ul>

            <ul class="footer-list-3">
                <p class="footer-link-large">More</p>
                <li><a class="footer-link" href="#">For Contactors</a></li>
                <li><a class="footer-link" href="naturalGas.html">For Non-profits</a>
                <li><a class="footer-link" href="naturalGas.html">For governments</a>
            </ul>

            <ul class="footer-list-4">
                <p class="footer-link-large">Legal</p>
                <li><a class="footer-link" href="#">Site Map</a></li>
                <li><a class="footer-link" href="water.html">Privacy Policy</a></li>
                <li><a class="footer-link" href="naturalGas.html">Terms & Conditions</a>
            </ul>
            <div class="footer-list-5 margin-bottom-24">
                <a class="footer-link" href="./index.html"> © Integrity Plumbing Solutions Inc.</a>
            </div>
        </div>

    </footer>
        `
    }
}

customElements.define('my-footer', MyFooter )
