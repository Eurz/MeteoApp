class SetMessage {
    constructor(message, root, targetElement = document.body, options = {}) {
        this.message = message
        this.root = root
        this.targetElement = targetElement
        console.log(targetElement)
        this.options = Object.assign(
            {},
            {
                delay: '1s',
                duration: '0.5s',
            },
            options
        )
        // console.log(this.message)

        // const target = document.querySelector(this.targetElement)
        const btnTest = document.querySelector('#test')
        btnTest.addEventListener('click', () => {
            this.setAnimation(this.targetElement, this.options)
        })
    }

    /**
     *
     * @param {HTMLElement} target - Element receiving message
     * @param {Object} properties - Properties for css transitions
     * @param {String} properties.duration - Duration of animation's box
     * @param {String} properties.property - Property(ies) to animate
     */
    setAnimation(target, properties) {
        target.textContent = this.message
        target.className = 'message'
        target.style.transform = 'translateY(0)'
        target.style.transitionProperty = 'transform'
        target.style.transitionDuration = properties.duration

        target.addEventListener('transitionstart', function (e) {
            console.log(e)
            e.target.textContent = 'transitionstart fired'
        })

        target.addEventListener('transitionend', function (e) {
            console.log(e)
            e.target.textContent = 'transitionend Terminée'
            target.style.transform = 'translateY(-100px)'
            target.style.transitionDelay = properties.delay
        })
    }
}

const messageBox = new SetMessage(
    "J'envoi des messages!!",
    document.body,
    document.querySelector('#message')
)
