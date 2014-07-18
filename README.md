# Report Data Generator

Used to generate some json so we can create some D3 graphs.

## Setup
* `php composer.phar install`  
* `php -S localhost:4000`

Note about composer:  
You should install composer globally.  
That way you can use it anywhere and we don't know need include the .phar in every project.

`/usr/local/bin` must be in your `$PATH` for this to work.

```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```