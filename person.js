const drawRad = 5;
var walkSpeed = 15;
var infection_prob = 0.75;
var infection_distance = drawRad*3;
var death_prob = 0.1;
var incubation_period=7;

const ZERO_CHANCE = 0.001;

const MAX_VEL=40;

const states = {
    HEALTHY: 0,
    INFECTED: 1,
    REMOVED: 2,
    RECOVERED:3
};


class Person {
    constructor() {
        this.pos = [Math.random() * WIDTH, Math.random() * HEIGHT];
        this.vel = [(Math.random() *2 - 1)*walkSpeed, (Math.random() *2 - 1)*walkSpeed];
        this.state = states.HEALTHY;
        this.showRadius=false;
    }
    clampVelocity()
    {
        let velSquared;
        if((velSquared=this.vel[0]**2+this.vel[1]**2)>=MAX_VEL**2)
        {
            let velMag=Math.sqrt(velSquared);
            let uvecX=this.vel[0]/velMag;
            let uvecY=this.vel[1]/velMag;

            this.vel[0]=uvecX*MAX_VEL;
            this.vel[1]=uvecY*MAX_VEL;
        }
    }
    update() {

        let delta=time-this.infection_time;
        if(this.state==states.INFECTED && delta>incubation_period)
        {
            let chance = Math.random();
            if (chance <= death_prob && chance > ZERO_CHANCE)
            {   
                this.state = states.REMOVED;
                this.vel[0]=0;
                this.vel[1]=0;
            }
            else
               this.state=states.RECOVERED;
        }

        if(this.state!=states.REMOVED)
        {
        this.vel[0] += (Math.random() *2 - 1)*walkSpeed*tick_interval;
        this.vel[1] += (Math.random() *2 - 1)*walkSpeed*tick_interval;


        this.clampVelocity();

        this.pos[0] += this.vel[0]*tick_interval;
        this.pos[1] += this.vel[1]*tick_interval;

        if (this.pos[0]-drawRad<=0)
        {
            this.pos[0]=drawRad;
            this.vel[0]=-this.vel[0];
        }
        else if(this.pos[0]+drawRad>=WIDTH)
        {
            this.pos[0]=WIDTH-drawRad;
            this.vel[0]=-this.vel[0];
        }

        if (this.pos[1]-drawRad<=0)
        {
            this.pos[1]=drawRad;
            this.vel[1]=-this.vel[1];
        }
        else if(this.pos[1]+drawRad>=HEIGHT)
        {
            this.pos[1]=HEIGHT-drawRad;
            this.vel[1]=-this.vel[1];
        }
    }
    }
    draw() {
        if(this.showRadius)
        {
            fill(173, 216, 230,128);
            ellipse(this.pos[0],this.pos[1],infection_distance*2,infection_distance*2);
        }

        switch (this.state) {
            case states.HEALTHY:
                fill(255);
                break;
            case states.INFECTED:
                fill(255, 0, 0);
                break;
            case states.REMOVED:
                fill(128);
                break;
            case states.RECOVERED:
                fill(25,98,230);
                break;
        }
        ellipse(this.pos[0], this.pos[1], drawRad*2, drawRad*2);
    }
    interact(person) {
        if ((person.pos[0] - this.pos[0]) ** 2 + (person.pos[1] - this.pos[1]) ** 2 <= infection_distance ** 2) {
            
            //If this is infected check to infect person
            if (this.state == states.INFECTED) {
                if (person.state == states.HEALTHY && Math.random()  <= infection_prob) {
                    person.state = states.INFECTED;
                    person.infection_time = time;
                }
            }
            //If this is healthy check to infect him by person
            else if (person.state == states.INFECTED) {
                if (this.state == states.HEALTHY && Math.random() <= infection_prob) {
                    this.state = states.INFECTED;
                    this.infection_time = time;
                }
            }
        }
    }
}