var DEFAULT_SYSTEMS = {
    'koch': {
        'angle': 36,
        'start': 'F',
        'rules': {
            'F': 'F-F+F[X]+F-F',
            'X': '+X'
        },
        'iter': 5,
        'smooth': false
    }
};

var system = Object.assign({}, DEFAULT_SYSTEMS.koch);

function init() {
    paper.setup(document.getElementById('canvas'));
    rivets.configure({preloadData: true});
    rivets.bind($('#input'), {
        data: {
            system: system
        },
        controller: {
            update: function(ev, model) {
                model.data.system.angle = +$("#angle").val() || system.angle;
                model.data.system.iter = +$("#iter").val() || system.iter;
                model.data.system.start = $("#start").val() || "F";

                model.data.system.rules = {};
                var lines = $("#rules").val().split('\n');

                for (var idx in lines) {
                    var pair = lines[idx].split("->");

                    if (pair.length !== 2) {
                        continue;
                    }

                    model.data.system.rules[pair[0].trim()] = pair[1].trim();
                }


                render(model.data.system);
            }
        }
    });

    render(system);
}

function render(system) {
    var movement = new paper.Point(0, -10);
    paper.project.clear();

    var currentPoint = new paper.Point(paper.view.center);
    var stack = [];

    function step(path, str, iter) {
        if (iter > system.iter) return path;

        for (var idx in str) {
            var command = str[idx];

            switch (command) {
            case '+': {
                movement = movement.rotate(system.angle, new paper.Point(0, 0));
                break;
            }
            case '-': {
                movement = movement.rotate(-system.angle, new paper.Point(0, 0));
                break;
            }
            case '[': {
                stack.push(currentPoint);
                stack.push(movement);
                break;
            }
            case ']': {
                movement = stack.pop();
                currentPoint = stack.pop();
                path.moveTo(currentPoint);
                break;
            }
            default:
                if (command == command.toUpperCase()) {
                    currentPoint = currentPoint.add([movement.x ,movement.y]);
                    path.lineTo(currentPoint);
                }

                var next = system.rules[command];
                path = step(path, next, iter + 1);
            }
        }

        return path;
    }

    var path = new paper.CompoundPath();
    path.moveTo(path.project.view.center);

    path = step(path, system.start, 0);
    path.strokeWidth = 2.0;
    path.fitBounds(new paper.Rectangle(0, 0, window.innerWidth, window.innerHeight));

    // this defines the region of the svg canvas that will be viewed
    // centered around (0,0)
    path.strokeJoin = 'bevel';
    path.project.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

    path.strokeColor = '#aaa';

    var rect = new paper.Path.Rectangle({
        point: [0, 0],
        size: [paper.view.size.width, paper.view.size.height],
        strokeColor: 'white',
        selected: true
    });

    rect.sendToBack();
    rect.fillColor = '#2c2c2c';

    system.smooth && path.smooth();
    path.shadowBlur = 30;
    paper.view.draw();

    return path;
}
