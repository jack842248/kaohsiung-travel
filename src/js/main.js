import '../../node_modules/bootstrap/scss/bootstrap.scss';
import '../scss/style.scss';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './all.js';
import '../../node_modules/jquery/dist/jquery.min.js';


function importAll(r){
    r.keys().forEach(r);
}
importAll(require.context( '../images' , false , /\.(gif|png|jpe?g|svg|webp)$/i ));